'use client'

import AlertList from "@/components/alerts/AlertList";
import {useAlerts} from "@/hooks/useAlerts";
import {Button} from "@/components/ui/button";
import React from "react";
import {redirect} from "next/navigation";

export function AlertCommand() {
    const {
        alerts,
        loading,
        updateAlert,
        deleteAlert,
    } = useAlerts();
    // FIX THIS

    if (loading) return <p>Loading alerts...</p>;

    return (
        <div>
        <div className="alert-actions">
            <h2 className="alert-title">Alert</h2>
            <Button className="search-btn" onClick={() => redirect("/alerts")}>Create Alert</Button>
        </div>

        <div>
        <AlertList alerts={alerts} updateAlert={updateAlert} deleteAlert={deleteAlert} />
        </div>
        </div>
    )
}