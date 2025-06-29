"use client";

import React, { useEffect, useState } from "react";
import TabGroup from "../components/TabGroup";
import GMPTable from "../components/GMPTable";
import { parseGmpJson, GMPReport } from "../utils/parseGmpJson";
import { gmpPages } from "../utils/gmpPages";

const fetchGmpData = async (): Promise<GMPReport[]> => {
    try {
        // Use window.location.pathname to get the base path at runtime
        let base = "";
        if (typeof window !== "undefined") {
            const match = window.location.pathname.match(/^(\/[^\/]+)?\//);
            base = match && match[1] ? match[1] : "";
        }
        const res = await fetch(`${base}/reports/gmp.json`);
        if (!res.ok) {
            console.error("Failed to fetch gmp.json", res.status, res.statusText);
            return [];
        }
        const raw = await res.json();
        return parseGmpJson(raw);
    } catch (e) {
        console.error("Error fetching gmp.json", e);
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

    const tabKeyMap: Record<string, string> = {
        "All GMP": "allGMP",
        "Current Market GMP": "currentGMP",
        "Mainboard GMP": "mainboardGMP",
        "SME GMP": "smeGMP",
        "All IPO Performance": "allPerf",
        "Mainline IPO Performance": "mainlinePerf",
        "SME IPO Performance": "smePerf",
    };
    const currentKey = tabKeyMap[activeTab];
    const sourceUrl = currentKey ? gmpPages[currentKey] : undefined;

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
        <main>
            <h1>IPO GMP Dashboard</h1>
            <TabGroup
                tabs={reports.map((r) => r.title)}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            {current && headers.length ? (
                <GMPTable headers={headers} rows={current.data} title={current.title} />
            ) : (
                <div className="noDataMsg">
                    No data available for this tab.
                </div>
            )}
            <footer>
                Data scraped from {sourceUrl ? (
                    <a href={sourceUrl} target="_blank" rel="noopener noreferrer">{sourceUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}</a>
                ) : (
                    <span>investorgain.com</span>
                )}
            </footer>
        </main>
    );
}
