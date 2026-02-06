import {NextRequest, NextResponse } from "next/server";
import {Alert} from "@/database/models/alert.model";
import {connectDB} from "@/database/mongoose";
import {auth} from "@/lib/better-auth/auth";
import {headers} from "next/headers";
import {revalidatePath} from "next/cache";

export async function PUT(req: NextRequest, {params}: {params: Promise<{id: string}>}){
    try {
        const session = await auth.api.getSession({headers: await headers()});
        if (!session?.user) return NextResponse.json({error: "Unauthorized"}, {status: 401});

        const { id } = await params;

        const body: UpdateAlertPayload = await req.json();

        await connectDB();

        const update: Record<string, any> = {};

        if (body.threshold !== undefined) update.threshold = body.threshold;
        if (body.condition) update.condition = body.condition;
        if (body.frequency) update.frequency = body.frequency;

        const updatedAlert = await Alert.findOneAndUpdate(
            { _id: id, userId: session.user.id },
            { $set: update },
            { new: true },
        );

        if (!updatedAlert) {
            return NextResponse.json({ message: "Alert not found" }, { status: 404 });
        }

        const alertDTOs: AlertDTO = {
            id: updatedAlert._id.toString(),
            symbol: updatedAlert.identifier,
            company: updatedAlert.name,
            alertName: updatedAlert.name,
            alertType: updatedAlert.condition === "Greater than" ? "upper" : updatedAlert.condition === "Less than" ? "lower" : "equal",
            condition: updatedAlert.condition,
            frequency: updatedAlert.frequency as AlertFrequency,
            threshold: updatedAlert.threshold,
        };

        revalidatePath("/watchlist");

        console.log("Alert has been successfully updated");
        return NextResponse.json({alert: alertDTOs}, {status: 200});
    }
    catch (err) {
        console.error("Alert failed to be updated", err);
        return NextResponse.json({message: 'Error updating alerts', error: err instanceof Error ? err.message : "Unknown"}, {status: 500})
    }
}

export async function DELETE(_: Request, {params}: {params: Promise<{id: string}> }) {
    try {
        const session = await auth.api.getSession({headers: await headers()});
        if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;

        await connectDB();

       const deletedAlert =  await Alert.findOneAndDelete({ _id: id, userId: session.user.id, });

       if (!deletedAlert) {
           return NextResponse.json({ message: "Alert not found" }, { status: 404 });
       }

        revalidatePath("/watchlist");

        return NextResponse.json({message: "Alert has been successfully deleted"}, {status: 200});
    }
    catch (err) {
        console.error("Alert failed to be deleted", err);
        return NextResponse.json({message: 'Error deleting alerts', error: err instanceof Error ? err.message : "Unknown"}, {status: 500});
    }
}