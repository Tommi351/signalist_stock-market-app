'use server';

import { connectDB } from '@/database/mongoose';
import {Watchlist} from '@/database/models/watchlist.model';

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
