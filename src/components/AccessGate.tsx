"use client";

import React, { useEffect, useState } from "react";

const STORAGE_KEY = "ipo-gmp-token";

// const VALIDATION_ENDPOINT = "http://localhost:3333/api/ipo-gmp/validate-token";
const VALIDATION_ENDPOINT = "https://encryption-hub.onrender.com/api/ipo-gmp/validate-token";


const REVALIDATE_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

const AccessGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [unlocked, setUnlocked] = useState(false);
    const [input, setInput] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    // Initial token check on mount
    useEffect(() => {
        const storedToken = localStorage.getItem(STORAGE_KEY);
        if (!storedToken) {
            setLoading(false);
            return;
        }

        const validate = async () => {
            try {
                const res = await fetch(VALIDATION_ENDPOINT, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: storedToken }),
                });

                const json = await res.json();
                if (json.success) {
                    setUnlocked(true);
                } else {
                    console.warn("🔒 Token is no longer valid. Locking.");
                    localStorage.removeItem(STORAGE_KEY);
                }
            } catch {
                console.warn("⚠️ Server unreachable. Gracefully unlocking.");
                setUnlocked(true); // fallback access
            } finally {
                setLoading(false);
            }
        };

        validate();
    }, []);

    // Background token revalidation
    useEffect(() => {
        if (!unlocked) return;

        const interval = setInterval(async () => {
            const storedToken = localStorage.getItem(STORAGE_KEY);
            if (!storedToken) return;

            try {
                const res = await fetch(VALIDATION_ENDPOINT, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: storedToken }),
                });

                const json = await res.json();
                if (!json.success) {
                    console.warn("🔒 Revalidation failed. Locking user.");
                    localStorage.removeItem(STORAGE_KEY);
                    setUnlocked(false);
                }
            } catch {
                console.log("🕓 Revalidation skipped (offline)");
            }
        }, REVALIDATE_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [unlocked]);

    const validateToken = async (token: string) => {
        try {
            const res = await fetch(VALIDATION_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });

            const json = await res.json();
            if (json.success) {
                localStorage.setItem(STORAGE_KEY, token);
                setUnlocked(true);
            } else {
                setError("❌ Invalid token. Please try again.");
                localStorage.removeItem(STORAGE_KEY);
            }
        } catch (e) {
            console.error("Server error:", e);
            setError("⚠️ Could not reach server. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (input.trim()) {
            setLoading(true);
            validateToken(input.trim());
        }
    };

    if (unlocked) return <>{children}</>;

    if (loading)
        return (
            <div style={{ color: "#fff", padding: 24 }}>
                🔐 Validating access token...
            </div>
        );

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "#111",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
            }}
        >
            <form
                onSubmit={handleSubmit}
                style={{
                    background: "#fff",
                    padding: "2rem",
                    borderRadius: "12px",
                    boxShadow: "0 0 20px rgba(0,0,0,0.2)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    minWidth: "300px",
                }}
            >
                <h2 style={{ marginBottom: "1rem", color: "#222" }}>
                    Enter Access Token
                </h2>
                <input
                    type="password"
                    placeholder="Your access token"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{
                        fontSize: "1rem",
                        padding: "0.5rem 1rem",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        marginBottom: "1rem",
                        width: "100%",
                    }}
                    autoFocus
                />
                <button
                    type="submit"
                    style={{
                        fontSize: "1rem",
                        padding: "0.5rem 1.5rem",
                        borderRadius: "8px",
                        background: "#007a3d",
                        color: "#fff",
                        border: 0,
                        cursor: "pointer",
                    }}
                >
                    Unlock
                </button>
                {error && (
                    <div style={{ color: "#c1121f", marginTop: "1rem" }}>{error}</div>
                )}
            </form>
        </div>
    );
};

export default AccessGate;
