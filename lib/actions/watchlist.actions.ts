'use server';

import { revalidatePath } from 'next/cache';
import { connectDB } from '@/database/mongoose';
import {Watchlist} from '@/database/models/watchlist.model';
import {auth} from "@/lib/better-auth/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";


export const getWatchlistSymbolsByEmail = async (email: string): Promise<string[]> => {
    if (!email) return [];
    try {
        const mongoose = await connectDB();
        const db = mongoose.connection.db;
        
        if (!db) {
            throw new Error('MongoDB connection failed');
        }

        // Find user by email in Better Auth user collection
        const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

        if (!user) {
            return [];
        }

        const userId = (user.id as string) || String(user._id || '');
        
        if (!userId) {
            return [];
        }

        // Query watchlist for this user
        const watchlistItems = await Watchlist.find({ userId }, { symbol: 1 }).lean();

        return watchlistItems.map((item) => String(item.symbol));
    } catch (error) {
        console.error('Error fetching watchlist symbols by email:', error);
        return [];
    }
};

// Add stock to watchlist
export const addToWatchlist = async (symbol: string, company: string) => {
    const session = await auth.api.getSession({headers: await headers()});
    if (!session?.user) redirect(`/log-in`);

    try {
        const existingStock = await Watchlist.findOne({
            userId: session.user.id,
            symbol: symbol.toUpperCase(),
        });

        if (existingStock) {
            return {success: false, error: 'Stock already in watchlist'};
        }

        const stock = new Watchlist({
            userId: session.user.id,
            symbol: symbol.toUpperCase(),
            company: company.trim()
        });

        await stock.save();
        revalidatePath('/watchlist');

        return {success: true, message: 'Stock has been added to watchlist!'};
    } catch (err) {
         console.error("Error adding stocks to watchlist", err);
        throw new Error('Failed to add stock to watchlist');
    }
};

// Remove stock from WatchList
export const removeFromWatchlist = async (symbol: string) => {
    try {
        const session = await auth.api.getSession({headers: await headers()});

        if (!session?.user) redirect(`/log-in`);

         await Watchlist.deleteOne({
            userId: session.user.id,
            symbol: symbol.toUpperCase(),
        });
        revalidatePath('/watchlist');

        return {success: true, message: 'Stock has been removed from watchlist!'};
    } catch (err) {
        console.error("Error removing stocks from watchlist", err);
        throw new Error('Failed to remove stock from watchlist');
    }
};
