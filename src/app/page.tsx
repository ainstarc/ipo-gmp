"use client";

import React, { useEffect, useState } from "react";
import TabGroup from "../components/TabGroup";
import GMPTable from "../components/GMPTable";
import { parseGmpJson, GMPReport } from "../utils/parseGmpJson";

const fetchGmpData = async (): Promise<GMPReport[]> => {
    try {
        const res = await fetch("/reports/gmp.json");
        if (!res.ok) return [];
        const raw = await res.json();
        return parseGmpJson(raw);
    } catch {
        return [];
    }
};

export default function HomePage() {
    const [reports, setReports] = useState<GMPReport[]>([]);
    const [activeTab, setActiveTab] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGmpData().then((data) => {
            setReports(data);
            setActiveTab(data[0]?.title || "");
            setLoading(false);
        });
    }, []);

    if (loading) return <div style={{ padding: 32 }}>Loading...</div>;
    if (!reports.length)
        return (
            <div style={{ padding: 32, color: "#888" }}>
                No GMP data found. Please check back later.
            </div>
        );

    const current = reports.find((r) => r.title === activeTab);
    const headers = current?.data?.length ? Object.keys(current.data[0]) : [];

    return (
        <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
            <h1 style={{ marginBottom: 24 }}>IPO GMP Dashboard</h1>
            <TabGroup
                tabs={reports.map((r) => r.title)}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            {current && headers.length ? (
                <GMPTable headers={headers} rows={current.data} />
            ) : (
                <div style={{ color: "#888", marginTop: 32 }}>
                    No data available for this tab.
                </div>
            )}
        </main>
    );
}
