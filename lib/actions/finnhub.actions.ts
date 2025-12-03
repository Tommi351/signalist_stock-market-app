'use server';

import { getDateRange, validateArticle, formatArticle } from '@/lib/utils';

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const NEXT_PUBLIC_FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY ?? '';

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
                    const url = `${FINNHUB_BASE_URL}/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${NEXT_PUBLIC_FINNHUB_API_KEY}`;
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
        const url = `${FINNHUB_BASE_URL}/news?category=general&token=${NEXT_PUBLIC_FINNHUB_API_KEY}`;
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
