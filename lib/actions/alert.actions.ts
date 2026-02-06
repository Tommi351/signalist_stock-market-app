'use server';

import { connectDB } from '@/database/mongoose';
import {ObjectId} from "mongodb";

export const getUserForAlertsEmail = async (userId: string) => {
   try {
    const mongoose = await connectDB();
    const db = mongoose.connection.db;
    if (!db) throw new Error("MongoDB connection failed");

    const user = await db.collection('user').findOne(
        { $or: [{ id: userId }, { _id: new ObjectId(userId) }] },
        {projection: {_id: 1, id: 1, email: 1, name: 1}}
    );

    if (!user) return null;

    return {
        id: user.id || user._id.toString() || '',
        email: user.email,
        name: user.name,
    }

   } catch (err) {
       console.error("Error fetching user for alert email", err)
       return null;
   }
}
