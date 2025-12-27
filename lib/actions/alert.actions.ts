'use server';

import { revalidatePath } from 'next/cache';
import { connectDB } from '@/database/mongoose';
import { Alert } from '@/database/models/alert.model';
import {auth} from "@/lib/better-auth/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {ObjectId} from "mongodb";


export const getUserForAlertsEmail = async (userId: string) => {
   try {
    const mongoose = await connectDB();
    const db = mongoose.connection.db;
    if (!db) throw new Error("MongoDB connection failed");

    const user = await db.collection("user").findOne(
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


export const createAlert = async (name: string, identifier: string, type: string, condition: string, threshold: number, frequency: string) => {
    try {
        const session = await auth.api.getSession({headers: await headers()});
        if (!session?.user) redirect('/log-in');

        const existingAlert = await Alert.findOne({
            userId: session.user.id,
            identifier: identifier.toUpperCase(),
            condition: condition,
            threshold: threshold,
        });

        if (existingAlert) {
            return { success: false, error: "Alert already exists" }
        }
        
        const alert = new Alert({
            userId: session.user.id,
            name,
            identifier: identifier.toUpperCase().trim(),
            type,
            condition,
            threshold,
            frequency,
        });
        
        await alert.save();
        revalidatePath("/watchlist");

        return {success: true, message: "Alert has been successfully created"};
    }
    catch (err) {
        console.error("Alert failed to be created", err);
        throw new Error("Alert failed");
    }
}

export const removeAlert = async (identifier: string) => {
    try {
       const session = await auth.api.getSession({headers: await headers()});
       if (!session?.user) redirect("/log-in");

       await Alert.deleteOne({
          userId: session.user.id,
          identifier: identifier.toUpperCase(),
       });
       revalidatePath("/watchlist");

       return {success: true, message: "Alert has been successfully deleted"};
    }
    catch (err) {
        console.error("Alert failed to be deleted", err);
        throw new Error("Alert removal failed");
    }
}