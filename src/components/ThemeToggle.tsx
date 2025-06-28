"use client";
import { useEffect, useState } from "react";

const THEME_KEY = "ipo-gmp-theme";

export default function ThemeToggle() {
    const [theme, setTheme] = useState<string | null>(null);

    useEffect(() => {
        // Check for saved theme or system preference
        const saved = localStorage.getItem(THEME_KEY);
        if (saved === "dark" || saved === "light") {
            setTheme(saved);
            document.documentElement.setAttribute("data-theme", saved);
        } else {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            const initial = prefersDark ? "dark" : "light";
            setTheme(initial);
            document.documentElement.setAttribute("data-theme", initial);
        }
    }, []);

    const toggleTheme = () => {
        const next = theme === "dark" ? "light" : "dark";
        setTheme(next);
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem(THEME_KEY, next);
    };

    // Hide button until theme is determined (prevents flicker)
    if (!theme) return null;

    return (
        <button
            aria-label="Toggle dark mode"
            onClick={toggleTheme}
            style={{
                position: "fixed",
                top: "2vw",
                right: "2vw",
                zIndex: 1000,
                background: theme === "dark" ? "#23272e" : "#fff",
                color: theme === "dark" ? "#e3e6eb" : "#23272e",
                border: "1px solid #888",
                borderRadius: "50%",
                width: "3vw",
                height: "3vw",
                fontSize: "1.5vw",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                cursor: "pointer",
                transition: "background 0.2s, color 0.2s"
            }}
        >
            {theme === "dark" ? "☀️" : "🌙"}
        </button>
    );
}
