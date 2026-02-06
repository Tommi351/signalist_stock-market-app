'use client';

// Render Alert Cards to the Watchlist Page
import React from 'react'
import AlertCard from "@/components/alerts/AlertCards";

const AlertList = ({alerts, updateAlert, deleteAlert}: AlertsListProps) => {

    console.log("AlertList render", alerts);
    return (
        <ul className="alert-list">
            {alerts.map((alert) => (
                <AlertCard
                    key={alert.id}
                    {...alert}
                    updateAlert={updateAlert}
                    deleteAlert={deleteAlert}
                />
            ))}
        </ul>
    )
}

export default AlertList;