"use client";

import {useCallback, useEffect, useState} from "react";

export function useAlerts() {
    const [alerts, setAlerts] = useState<AlertDTO[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAlerts = useCallback(async () => {
        const res = await fetch("/api/alerts");
        if (!res.ok) throw new Error("Failed to fetch alerts");

        const json = await res.json();
        setAlerts(json.data);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchAlerts();
    }, [fetchAlerts]);

    const createAlert = async (payload: CreateAlertPayload) => {
        const res = await fetch("/api/alerts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Create failed");

        const json = await res.json();
        setAlerts((prev) => [...prev, json.alert]);

        return json;
    };

    const updateAlert = async (id: string, payload: UpdateAlertPayload) => {
        const res = await fetch(`/api/alerts/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const err = await res.json();
            console.error("Failed to update alert", err);
            return; // bail early
        }

        const updated = await res.json();

        // 1️⃣ Update client state immediately
        setAlerts(prev => {
            const next = prev.map(a => (a.id === id ? updated.alert : a))
            console.log("NEW ALERTS STATE", next);
            return next;
          }
        );
    };

    const deleteAlert = async (id: string) => {
        await fetch(`/api/alerts/${id}`, { method: "DELETE" });
        // 1️⃣ Update client state immediately
        setAlerts(prev => prev.filter(a => a.id !== id));
    };

    return {
        alerts,
        loading,
        createAlert,
        updateAlert,
        deleteAlert,
        refetch: fetchAlerts,
    };
}
