import {NextRequest, NextResponse } from "next/server";
import {Alert} from "@/database/models/alert.model";
import {connectDB} from "@/database/mongoose";
import {auth} from "@/lib/better-auth/auth";
import {headers} from "next/headers";
import {inngest} from "@/lib/inngest/client";
import {revalidatePath} from "next/cache";

export async function GET() {
    try {
        const session = await auth.api.getSession({headers: await headers()});
        if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectDB();

        const alerts = await Alert.find({userId: session.user.id});

        const alertDTOs: AlertDTO[] = await Promise.all(
            alerts.map((alert) => {
                return {
                    id: alert._id.toString(),
                    symbol: alert.identifier,
                    company: alert.name,
                    alertName: alert.name,
                    condition: alert.condition === "Greater than" ? "Greater than" : "Less than",
                    alertType: alert.condition === "Greater than" ? "upper" : "lower",
                    frequency: alert.frequency as AlertFrequency,
                    threshold: alert.threshold,
                };
            })
        );

        return NextResponse.json({ success: true, data: alertDTOs }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: 'Error fetching alerts', error: error instanceof Error ? error.message : "Unknown"}, {status: 500});
    }
}


export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({headers: await headers()});
        if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectDB();

        const body = await req.json();

        const {
            symbol,
            company,
            alertName,
            alertType,
            threshold,
            condition,
            frequency,
        } = body;

        const existingAlert = await Alert.findOne({
            userId: session.user.id,
            identifier: symbol.toUpperCase().trim(),
            condition: condition,
            threshold: threshold,
        });

        if (existingAlert) {
            return NextResponse.json({message: 'Alert already exists'}, {status: 409});
        }

        const newAlert = await Alert.create(
                  {
                    userId: session.user.id,
                    name: alertName || company.toUpperCase().trim(),
                      type: alertType,
                    identifier: symbol.toUpperCase().trim(),
                    threshold,
                    condition,
                      frequency,
                  }
        );

        if (!newAlert) throw new Error("Failed to create alert");

        const alertDTOs: AlertDTO = {
            id: newAlert._id.toString(),
            symbol: newAlert.identifier,
            company: newAlert.name,
            alertName: newAlert.name,
            condition: newAlert.condition === "Greater than" ? "Greater than" : "Less than",
            alertType: newAlert.condition === "Greater than" ? "upper" : "lower",
            frequency: newAlert.frequency as AlertFrequency,
            threshold: newAlert.threshold,
        };

        await inngest.send({
            name: "app/sent.alert",
            data: {alertId: newAlert._id.toString()}
        });

        revalidatePath("/watchlist");

        return NextResponse.json({message: 'Alert created successfully', alert: alertDTOs}, {status: 201});
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: 'Error creating alerts', error: error instanceof Error ? error.message : "Unknown"}, {status: 500});
    }
}