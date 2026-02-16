import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/better-auth/auth";

export async function POST(req: NextRequest) {
    try {
        const { provider, callbackURL } = await req.json();
        const auth = await getAuth();

        const result = await auth.api.signInSocial({
            body: { provider, callbackURL },
        });

        return NextResponse.json(result);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
