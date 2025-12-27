'use server';
import {cache} from 'react';

import { auth } from '../better-auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import {getWatchlistSymbolsByEmail} from "@/lib/actions/watchlist.actions";
import {getDateRange, validateArticle, formatArticle, formatPrice, formatChangePercent, formatMarketCapValue} from '@/lib/utils';
import {POPULAR_STOCK_SYMBOLS} from "@/lib/constants";
import {Watchlist} from "@/database/models/watchlist.model";

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

if (!FINNHUB_API_KEY) {
    throw new Error('FINNHUB_API_KEY environment variable is required but not set');
}

type FetchOptions = {
    cache?: 'force-cache' | 'no-store';
    next?: {
        revalidate?: number;
    };
};

const fetchJSON = async <T>(url: string, revalidateSeconds?: number): Promise<T> => {
    const options: FetchOptions = revalidateSeconds
        ? { cache: 'force-cache', next: { revalidate: revalidateSeconds } }
        : { cache: 'no-store' };

    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
};

export const getNews = async (symbols?: string[]): Promise<MarketNewsArticle[]> => {
    try {
        const { from, to } = getDateRange(5);

        // If symbols provided, fetch company news with round-robin
        if (symbols && symbols.length > 0) {
            const cleanedSymbols = symbols
                .map((s) => s.trim().toUpperCase())
                .filter((s) => s.length > 0);

            if (cleanedSymbols.length === 0) {
                return getNews(); // Fallback to general news
            }

            const articles: MarketNewsArticle[] = [];
            const maxRounds = 6;

            for (let round = 0; round < maxRounds; round++) {
                const symbolIndex = round % cleanedSymbols.length;
                const symbol = cleanedSymbols[symbolIndex];

                try {
                    const url = `${FINNHUB_BASE_URL}/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`;
                    const companyNews = await fetchJSON<RawNewsArticle[]>(url);

                    // Find first valid article not already collected
                    const validArticle = companyNews.find(
                        (article) =>
                            validateArticle(article) &&
                            !articles.some((a) => a.url === article.url)
                    );

                    if (validArticle) {
                        articles.push(formatArticle(validArticle, true, symbol, round));
                    }
                } catch (error) {
                    console.error(`Error fetching news for ${symbol}:`, error);
                }

                if (articles.length >= 6) break;
            }

            // If no articles found, fallback to general news
            if (articles.length === 0) {
                return getNews();
            }

            // Sort by datetime (most recent first)
            return articles.sort((a, b) => b.datetime - a.datetime);
        }

        // No symbols provided, fetch general market news
        const url = `${FINNHUB_BASE_URL}/news?category=general&token=${FINNHUB_API_KEY}`;
        const marketNews = await fetchJSON<RawNewsArticle[]>(url);

        // Deduplicate by id, url, and headline
        const seen = new Set<string>();
        const uniqueArticles: RawNewsArticle[] = [];

        for (const article of marketNews) {
            if (!validateArticle(article)) continue;

            const key = `${article.id}-${article.url}-${article.headline}`;
            if (seen.has(key)) continue;

            seen.add(key);
            uniqueArticles.push(article);

            if (uniqueArticles.length >= 6) break;
        }

        return uniqueArticles.map((article, index) => formatArticle(article, false, undefined, index));
    } catch (error) {
        console.error('Error fetching news:', error);
        throw new Error('Failed to fetch news');
    }
};

export const searchStocks = cache(
    async (query?: string): Promise<StockWithWatchlistStatus[]> => {
        try {
            const session = await auth.api.getSession({
                headers: await headers(),
            });
            if (!session?.user) redirect('/sign-in');

            const userWatchlistSymbols = await getWatchlistSymbolsByEmail(
                session.user.email
            );

            const token = process.env.FINNHUB_API_KEY ?? process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
            if (!token) {
                // If no token, log and return empty to avoid throwing per requirements
                console.error(
                    'Error in stock search:',
                    new Error('FINNHUB API key is not configured')
                );
                return [];
            }

            const trimmed = typeof query === 'string' ? query.trim() : '';

            let results: FinnhubSearchResult[] = [];

            if (!trimmed) {
                // Fetch top 10 popular symbols' profiles
                const top = POPULAR_STOCK_SYMBOLS.slice(0, 10);
                const profiles = await Promise.all(
                    top.map(async (sym) => {
                        try {
                            const url = `${FINNHUB_BASE_URL}/stock/profile2?symbol=${encodeURIComponent(
                                sym
                            )}&token=${token}`;
                            // Revalidate every hour
                            const profile = await fetchJSON<any>(url, 3600);
                            return { sym, profile } as { sym: string; profile: any };
                        } catch (e) {
                            console.error('Error fetching profile2 for', sym, e);
                            return { sym, profile: null } as { sym: string; profile: any };
                        }
                    })
                );

                results = profiles
                    .map(({ sym, profile }) => {
                        const symbol = sym.toUpperCase();
                        const name: string | undefined =
                            profile?.name || profile?.ticker || undefined;
                        const exchange: string | undefined = profile?.exchange || undefined;
                        if (!name) return undefined;
                        const r: FinnhubSearchResult = {
                            symbol,
                            description: name,
                            displaySymbol: symbol,
                            type: 'Common Stock',
                        };
                        // We don't include exchange in FinnhubSearchResult type, so carry via mapping later using profile
                        // To keep pipeline simple, attach exchange via closure map stage
                        // We'll reconstruct exchange when mapping to final type
                        (r as any).__exchange = exchange; // internal only
                        return r;
                    })
                    .filter((x): x is FinnhubSearchResult => Boolean(x));
            } else {
                const url = `${FINNHUB_BASE_URL}/search?q=${encodeURIComponent(
                    trimmed
                )}&token=${token}`;
                const data = await fetchJSON<FinnhubSearchResponse>(url, 1800);
                results = Array.isArray(data?.result) ? data.result : [];
            }

            const mapped: StockWithWatchlistStatus[] = results
                .map((r) => {
                    const upper = (r.symbol || '').toUpperCase();
                    const name = r.description || upper;
                    const exchangeFromDisplay =
                        (r.displaySymbol as string | undefined) || undefined;
                    const exchangeFromProfile = (r as any).__exchange as
                        | string
                        | undefined;
                    const exchange = exchangeFromDisplay || exchangeFromProfile || 'US';
                    const type = r.type || 'Stock';
                    const item: StockWithWatchlistStatus = {
                        symbol: upper,
                        name,
                        exchange,
                        type,
                        isInWatchlist: userWatchlistSymbols.includes(
                            r.symbol.toUpperCase()
                        ),
                    };
                    return item;
                })
                .slice(0, 15);

            return mapped;
        } catch (err) {
            console.error('Error in stock search:', err);
            return [];
        }
    }
);

// Fetch stock details by symbol
export const getStocksDetails = cache(async (symbol: string) => {
    const cleanSymbol = symbol.trim().toUpperCase();

    try {
        const [quote, profile, financials] = await Promise.all([
            fetchJSON(
                // Price data - no caching for accuracy
                `${FINNHUB_BASE_URL}/quote?symbol=${cleanSymbol}&token=${FINNHUB_API_KEY}`
            ),
            fetchJSON(
                // Company info - cache 1hr (rarely changes)
                `${FINNHUB_BASE_URL}/stock/profile2?symbol=${cleanSymbol}&token=${FINNHUB_API_KEY}`,
                3600
            ),
            fetchJSON(
                // Financial metrics (P/E, etc.) - cache 30min
                `${FINNHUB_BASE_URL}/stock/metric?symbol=${cleanSymbol}&metric=all&token=${FINNHUB_API_KEY}`,
                1800
            ),
        ]);

        // Type cast the responses
        const quoteData = quote as QuoteData;
        const profileData = profile as ProfileData;
        const financialsData = financials as FinancialsData;

        // Check if we got valid quote and profile data
        if (!quoteData?.c || !profileData?.name)
            throw new Error('Invalid stock data received from API');

        const changePercent = quoteData.dp || 0;
        const peRatio = financialsData?.metric?.peNormalizedAnnual || null;

        return {
            symbol: cleanSymbol,
            company: profileData?.name,
            currentPrice: quoteData.c,
            changePercent,
            priceFormatted: formatPrice(quoteData.c),
            changeFormatted: formatChangePercent(changePercent),
            peRatio: peRatio?.toFixed(1) || '—',
            marketCapFormatted: formatMarketCapValue(
                profileData?.marketCapitalization || 0
            ),
        };
    } catch (error) {
        console.error(`Error fetching details for ${cleanSymbol}:`, error);
        throw new Error('Failed to fetch stock details');
    }
});

export const getUserWatchList = async () => {
    try {
        const session = await auth.api.getSession({headers: await headers()});
        if (!session?.user) redirect('/log-in');

        const watchList = await Watchlist.find({userId: session.user.id,})
            .sort({ addedAt: -1 })
            .lean();

        return JSON.parse(JSON.stringify(watchList));
    } catch (error) {
        console.error(`Error fetching details for user watchlist:`, error);
        throw new Error('Failed to fetch user watchlist:');
    }
};

// Get user's watchlist with stock data
export const getWatchlistWithData = async () => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session?.user) redirect('/sign-in');

        const watchlist = await Watchlist.find({ userId: session.user.id }).sort({ addedAt: -1 }).lean();

        if (watchlist.length === 0) return [];

        const stocksWithData = await Promise.all(
            watchlist.map(async (item) => {
                const stockData = await getStocksDetails(item.symbol);

                if (!stockData) {
                    console.warn(`Failed to fetch data for ${item.symbol}`);
                    return item;
                }

                return {
                    company: stockData.company,
                    symbol: stockData.symbol,
                    currentPrice: stockData.currentPrice,
                    priceFormatted: stockData.priceFormatted,
                    changeFormatted: stockData.changeFormatted,
                    changePercent: stockData.changePercent,
                    marketCap: stockData.marketCapFormatted,
                    peRatio: stockData.peRatio,
                };
            }),
        );

        return JSON.parse(JSON.stringify(stocksWithData));
    } catch (error) {
        console.error('Error loading watchlist:', error);
        throw new Error('Failed to fetch watchlist');
    }
};