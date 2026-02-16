import { betterAuth } from "better-auth";
import { mongodbAdapter} from "better-auth/adapters/mongodb";
import { connectDB } from "@/database/mongoose";
import { nextCookies} from "better-auth/next-js";

let authInstance: ReturnType<typeof betterAuth> | null = null;
const GOOGLE_CLIENT_ID = process.env.AUTH_GOOGLE_ID;
const GOOGLE_SECRET = process.env.AUTH_GOOGLE_SECRET;

const GITHUB_CLIENT_ID = process.env.AUTH_GITHUB_ID;
const GITHUB_SECRET = process.env.AUTH_GITHUB_SECRET;

export const getAuth = async () => {
    if(authInstance) return authInstance;

    const mongoose = await connectDB();
    const db = mongoose.connection.db;

    if(!db) throw new Error('MongoDB connection not found');

    const BASE_URL = process.env.NODE_ENV === 'production' ? "https://signalist-stock-market-app-fawn.vercel.app" : "http://localhost:3000";

    authInstance = betterAuth({
        database: mongodbAdapter(db as any),
        secret: process.env.BETTER_AUTH_SECRET,
        baseURL: BASE_URL,
        emailAndPassword: {
            enabled: true,
            disableSignUp: false,
            requireEmailVerification: false,
            minPasswordLength: 8,
            maxPasswordLength: 128,
            autoSignIn: true,
        },
        plugins: [nextCookies()],
        socialProviders: {
            google: {
                clientId: `${GOOGLE_CLIENT_ID}`,
                clientSecret: `${GOOGLE_SECRET}`,
            },
            github: {
                clientId: `${GITHUB_CLIENT_ID}`,
                clientSecret: `${GITHUB_SECRET}`,
            }
        },
    });

    return authInstance;
}

export const auth = await getAuth();