import React from "react";
import styles from "./styles/GMPTable.module.css";

interface GMPTableProps {
    headers: string[];
    rows: Record<string, string>[];
}

function cleanGmpValue(val: string) {
    if (!val) return "";
    // Remove fire emoji and 'Hot inbox' or similar text
    return val.replace(/🔥.*$/g, "").replace(/Hot inbox/gi, "").trim();
}

// Color scale for GMP % values
function getGmpColorClass(percent: number, theme: string) {
    if (percent <= -5) return theme === "dark" ? styles.gmpTextLevel1Dark : styles.gmpTextLevel1;
    if (percent > -5 && percent <= 0) return theme === "dark" ? styles.gmpTextLevel2Dark : styles.gmpTextLevel2;
    if (percent > 0 && percent <= 5) return theme === "dark" ? styles.gmpTextLevel3Dark : styles.gmpTextLevel3;
    if (percent > 5 && percent <= 15) return theme === "dark" ? styles.gmpTextLevel4Dark : styles.gmpTextLevel4;
    if (percent > 15 && percent <= 25) return theme === "dark" ? styles.gmpTextLevel5Dark : styles.gmpTextLevel5;
    if (percent > 25 && percent <= 35) return theme === "dark" ? styles.gmpTextLevel6Dark : styles.gmpTextLevel6;
    if (percent > 35 && percent <= 45) return theme === "dark" ? styles.gmpTextLevel7Dark : styles.gmpTextLevel7;
    if (percent > 45) return theme === "dark" ? styles.gmpTextLevel8Dark : styles.gmpTextLevel8;
    return theme === "dark" ? styles.gmpTextNeutralDark : styles.gmpTextNeutral;
}

function getCurrentTheme() {
    if (typeof document !== "undefined") {
        return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    }
    return "light";
}

function renderGmpValue(val: string) {
    const cleaned = cleanGmpValue(val);
    if (!cleaned || cleaned === "--" || cleaned === "₹-- (0.00%)" || cleaned === "0.00%") {
        return <span className={styles.gmpTextNeutral}>—</span>;
    }
    // Extract percentage value
    const match = cleaned.match(/([+-]?\d+\.?\d*)%/);
    if (match) {
        const percent = parseFloat(match[1]);
        const theme = getCurrentTheme();
        const colorClass = getGmpColorClass(percent, theme);
        return <span className={colorClass}>{cleaned}</span>;
    }
    return <span className={styles.gmpTextNeutral}>{cleaned}</span>;
}

function renderFire(val: string) {
    if (!val) return "—";
    // Count fire emojis
    const count = (val.match(/🔥/g) || []).length;
    if (count > 0) return <span style={{ color: "#ff9800", fontWeight: 600 }}>{count} 🔥</span>;
    return val;
}

function renderDate(val: string) {
    // Convert 27-Jun-2025 to 27-Jun
    if (/\d{2}-[A-Za-z]{3}-\d{4}/.test(val)) {
        return val.slice(0, 6);
    }
    return val;
}

// Helper to get fire count from a row
function getFireCount(row: Record<string, string>, headers: string[]): number {
    const fireHeader = headers.find(h => /fire/i.test(h));
    if (!fireHeader) return 0;
    const val = row[fireHeader] || "";
    return (val.match(/🔥/g) || []).length;
}

// Helper to get fire-based row background class
function getFireRowClass(fireCount: number) {
    if (fireCount >= 3) return styles.fireRow3;
    if (fireCount === 2) return styles.fireRow2;
    if (fireCount === 1) return styles.fireRow1;
    return "";
}

const GMPTable: React.FC<GMPTableProps> = ({ headers, rows }) => {
    // Remove trailing empty columns (headers with empty string or only whitespace)
    const cleanHeaders = headers.filter(h => h.trim() !== "");
    return (
        <div className={styles.tableWrapper}>
            <table className={styles.gmpTable}>
                <thead>
                    <tr>
                        {cleanHeaders.map((header) => (
                            <th key={header} className={styles.wrapCell}>
                                {header.replace(/▲▼/, "").replace(/_/g, " ").trim()}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => {
                        const fireCount = getFireCount(row, cleanHeaders);
                        const fireClass = getFireRowClass(fireCount);
                        return (
                            <tr key={i} className={`${i % 2 === 0 ? styles.evenRow : styles.oddRow} ${fireClass}`}>
                                {cleanHeaders.map((header) => {
                                    const val = row[header];
                                    if (/fire/i.test(header)) return <td key={header} className={styles.wrapCell}>{renderFire(val)}</td>;
                                    if (/gmp/i.test(header) || (/%/.test(val || "") && !/name/i.test(header))) return <td key={header} className={styles.wrapCell}>{renderGmpValue(val)}</td>;
                                    if (/date/i.test(header) && val) return <td key={header} className={styles.wrapCell}>{renderDate(val)}</td>;
                                    if (!val || val === "") return <td key={header} className={styles.wrapCell}>—</td>;
                                    return <td key={header} className={styles.wrapCell}>{val}</td>;
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default GMPTable;
