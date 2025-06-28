"use client";
import React, { useState, useEffect } from "react";

// Support multiple keys (comma-separated in env)
const ACCESS_KEYS = (process.env.NEXT_PUBLIC_ACCESS_KEYS || "").split(",").map(k => k.trim()).filter(Boolean);
const STORAGE_KEY = "ipo-gmp-access-key";

const AccessGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [unlocked, setUnlocked] = useState(false);
    const [input, setInput] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (ACCESS_KEYS.includes(stored || "")) setUnlocked(true);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (ACCESS_KEYS.includes(input)) {
            localStorage.setItem(STORAGE_KEY, input);
            setUnlocked(true);
        } else {
            setError("Invalid key. Please try again.");
        }
    };

    if (unlocked) return <>{children}</>;

    return (
        <div style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 9999,
            background: "rgba(20,24,32,0.97)", display: "flex", alignItems: "center", justifyContent: "center"
        }}>
            <form onSubmit={handleSubmit} style={{
                background: "#fff", padding: "2.5vw 4vw", borderRadius: "1vw", boxShadow: "0 4px 32px #0002",
                minWidth: 320, maxWidth: "90vw", display: "flex", flexDirection: "column", alignItems: "center"
            }}>
                <h2 style={{ marginBottom: 16, color: "#23272e" }}>Enter Access Key</h2>
                <input
                    type="password"
                    value={input}
                    onChange={e => { setInput(e.target.value); setError(""); }}
                    style={{ fontSize: 20, padding: "0.7em 1em", borderRadius: 8, border: "1px solid #bbb", marginBottom: 12, width: 220 }}
                    autoFocus
                />
                <button type="submit" style={{ fontSize: 18, padding: "0.5em 1.5em", borderRadius: 8, background: "#007a3d", color: "#fff", border: 0, cursor: "pointer" }}>
                    Unlock
                </button>
                {error && <div style={{ color: "#c1121f", marginTop: 10 }}>{error}</div>}
            </form>
        </div>
    );
};

export default AccessGate;
