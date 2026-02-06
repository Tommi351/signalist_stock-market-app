import { NextResponse } from "next/server";
import { getStocksDetails } from "@/lib/actions/finnhub.actions";

export async function GET(
    _: Request,
    {params}: {params: Promise<{symbol: string}> }
) {
    try {
        const {symbol} = await params;

        const stock = await getStocksDetails(symbol);

        // Only return the fields you care about
        const minimalStock = {
            currentPrice: stock.currentPrice,
            changePercent: stock.changePercent,
        };

        return NextResponse.json({ success: true, data: minimalStock });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to fetch stock data", error: error instanceof Error ? error.message : "Unknown"},
            { status: 500 }
        );
    }
}
