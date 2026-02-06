import {useState, useEffect} from "react";

type StockMinimal = {
    currentPrice: number;
    changePercent: number;
};

export function useStock(symbol: string) {
    const [stock, setStock] = useState<StockMinimal | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function fetchStock() {
            try {
                const res = await fetch(`/api/stocks/${symbol}`);
                const json = await res.json();
                if (!cancelled && json.success) setStock(json.data);
            } catch (err) {
                console.error(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchStock();
        return () => {
            cancelled = true;
        };
    }, [symbol]);

    return { stock, loading };
}
