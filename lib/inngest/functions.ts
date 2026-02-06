import {inngest} from "@/lib/inngest/client";
import {NEWS_SUMMARY_EMAIL_PROMPT, PERSONALIZED_WELCOME_EMAIL_PROMPT, UPPER_ALERT_SUMMARY_EMAIL_PROMPT, LOWER_ALERT_SUMMARY_EMAIL_PROMPT} from "@/lib/inngest/prompts";
import {sendNewsSummaryEmail, sendWelcomeEmail, sendAlertEmail} from "@/lib/nodemailer";
import {getAllUsersForNewsEmail} from "@/lib/actions/user.actions";
import {getWatchlistSymbolsByEmail} from "@/lib/actions/watchlist.actions";
import {getNews, getStocksDetails} from "@/lib/actions/finnhub.actions";
import {getUserForAlertsEmail} from "@/lib/actions/alert.actions";
import {Alert} from "@/database/models/alert.model";
import type { AlertItem } from "@/database/models/alert.model";

import { getFormattedTodayDate, evaluateAlertDirection} from "@/lib/utils";

export const sendSignUpEmail = inngest.createFunction(
    { id: 'sign-up-email' },
    { event: 'app/user.created'},
    async ({ event, step }) => {
        const userProfile = `
            - Country: ${event.data.country}
            - Investment goals: ${event.data.investmentGoals}
            - Risk tolerance: ${event.data.riskTolerance}
            - Preferred industry: ${event.data.preferredIndustry}
        `

        const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace('{{userProfile}}', userProfile)

        const response = await step.ai.infer('generate-welcome-intro', {
            model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
            body: {
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: prompt }
                        ]
                    }]
            }
        })

        await step.run('send-welcome-email', async () => {
            const part = response.candidates?.[0]?.content?.parts?.[0];
            const introText = (part && 'text' in part ? part.text : null) ||'Thanks for joining Signalist. You now have the tools to track markets and make smarter moves.'

            const { data: { email, name } } = event;

            return await sendWelcomeEmail({ email, name, intro: introText });
        })

        return {
            success: true,
            message: 'Welcome email sent successfully'
        }
    }
);

export const sendDailyNewsSummary = inngest.createFunction(
    { id: 'daily-news-summary' },
    [{ event: 'app/send.daily.news' }, { cron: '0 12 * * *' }],
    async ({ step }) => {
        // Step #1: Get all users for news delivery
        const users = await step.run('get-all-users', getAllUsersForNewsEmail);

        if (!users || users.length === 0) {
            return { success: false, message: 'No users found for news email.' };
        }

        // Step #2: Fetch personalized news for each user
        const newsPerUser = await step.run('fetch-users-news', async () => {
            const newsData: Array<{ user: User; news: MarketNewsArticle[] }> = [];

            for (const user of users) {
                try {
                    // Get user's watchlist symbols
                    const symbols = await getWatchlistSymbolsByEmail(user.email);

                    // Fetch news (company news if symbols exist, general market news otherwise)
                    let news = await getNews(symbols.length > 0 ? symbols : undefined);
                    // Enforce max 6 articles per user
                    news = (news || []).slice(0, 6);
                    if (!news || news.length === 0) {
                        news = await getNews();
                        news = (news || []).slice(0, 6);
                    }
                    newsData.push({ user, news });
                } catch (error) {
                    console.error(`Error fetching news for user ${user.email}:`, error);
                    // Fallback to general news on error
                    try {
                        const news = await getNews();
                        newsData.push({ user, news });
                    } catch (fallbackError) {
                        console.error(`Fallback news fetch failed for ${user.email}:`, fallbackError);
                    }
                }
            }

            return newsData;
        });

        // Step #3: TODO - Summarize news articles using AI for each user
        // This will use step.ai.infer() similar to sendSignUpEmail
        const userNewsSummaries: {user: User; newsContent: string | null}[] = [];

        for (const {user, news} of newsPerUser) {
            try {
                const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace('{{newsData}}', JSON.stringify(news, null, 2));

                const response = await step.ai.infer(`summarize-news-${user.email}`, {
                    model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
                    body: {
                        contents: [{ role: 'user', parts: [{ text: prompt}]}]
                    }
                });

                const part = response.candidates?.[0]?.content?.parts?.[0];
                const newsContent = (part && 'text' in part ? part.text : null) || 'No market news found';

                userNewsSummaries.push({ user, newsContent});
            } catch (e) {
                console.error('Failed to summarize news for :', user.email);
                userNewsSummaries.push({user, newsContent: null});
            }
        }

        // Step #4: TODO - Send email via Nodemailer
        // This will iterate through newsPerUser and send personalized emails
        await step.run('send-news-emails', async () => {
            await Promise.all(
                userNewsSummaries.map( async ({ user, newsContent }) => {
                    if (!newsContent) return false;

                    return await sendNewsSummaryEmail({ email: user.email, date: getFormattedTodayDate(), newsContent });
                })
            )
        });

        return {success: true, message: 'News Summary email sent successfully'};
    }
);

export const sendUserAlertEmail = inngest.createFunction(
    { id: 'user-alert' },
    { event: 'app/sent.alert'},
    async ({ event, step }) => {
        // Step #1: Fetch Alert as source of truth
        const alertId = event.data.alertId;

        const alertDoc = await Alert.findById(alertId).lean<AlertItem>();

        if (!alertDoc) throw new Error(`Alert with id ${alertId} not found`);

        // Step #2: Get user for alert email delivery
        const user = await step.run('get-user-for-alert-email', () => getUserForAlertsEmail(alertDoc.userId));
        if (!user) throw new Error(`User not found`);
        // Step #3: TODO - Fetch current stock price
        // Step #3: Fetch current stock price
        const symbol = alertDoc.identifier;
        const stockDetails = await step.run('get-stock-details', () => getStocksDetails(symbol));
        const currentPrice = stockDetails.currentPrice;

        // Step #4: TODO - Evaluate Alert's condition
        const direction = evaluateAlertDirection(alertDoc, currentPrice);

        if (!direction || direction === "equal") {
            console.log(`Alert for ${alertDoc.identifier} not triggered.`);
            return; // 🚫 stop early, no email
        }

        // Step `#5`: Send email based on condition(upper or lower) via Nodemailer
            await step.run('send-alert-email', async () => {
                const email = user.email;
                const symbol = alertDoc.identifier;
                const company = alertDoc.name;
                const timestamp = alertDoc.updatedAt.toISOString();

                return await sendAlertEmail({email, symbol, timestamp, company, currentPrice, targetPrice: alertDoc.threshold, alertDoc});
            });

            return {success: true, message: 'Alert email sent successfully'};
        }
);
