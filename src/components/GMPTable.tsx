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

function renderFire(val: string) {
    if (!val) return "—";
    // Count fire emojis
    const count = (val.match(/🔥/g) || []).length;
    const isDark = typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "dark";
    const icon = isDark ? "🌙" : "🔥";
    if (count > 0) return <span className={styles.fireBadge}>{count} {icon}</span>;
    return val;
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
        // Heatmap dot color
        const dotStyle = { background: getGmpHeatDotColor(percent, theme) };
        return <span><span className={styles.gmpHeatDot} style={dotStyle}></span><span className={colorClass}>{cleaned}</span></span>;
    }
    return <span className={styles.gmpTextNeutral}>{cleaned}</span>;
}

// Helper for heatmap dot color (reuse color scale)
function getGmpHeatDotColor(percent: number, theme: string) {
    if (percent <= -5) return theme === "dark" ? "#ff6b81" : "#8B0000";
    if (percent > -5 && percent <= 0) return theme === "dark" ? "#ff8c8c" : "#D73027";
    if (percent > 0 && percent <= 5) return theme === "dark" ? "#ffd580" : "#FDAE61";
    if (percent > 5 && percent <= 15) return theme === "dark" ? "#ffe066" : "#FEE08B";
    if (percent > 15 && percent <= 25) return theme === "dark" ? "#d9ef8b" : "#D9EF8B";
    if (percent > 25 && percent <= 35) return theme === "dark" ? "#91cf60" : "#91CF60";
    if (percent > 35 && percent <= 45) return theme === "dark" ? "#4be37a" : "#1A9850";
    if (percent > 45) return theme === "dark" ? "#4be3b2" : "#006837";
    return theme === "dark" ? "#b0b3b8" : "#888";
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

// Helper: get relative day info for a date string (IST)
function getRelativeDayInfo(dateStr: string) {
    // Expects format: 27-Jun-2025 or 2-Jul
    let dt: Date | null = null;
    let hasYear = false;
    let match = dateStr.match(/(\d{1,2})-([A-Za-z]{3})-(\d{4})/);
    if (match) {
        // Full date with year
        const [, d, m, y] = match;
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthIdx = months.indexOf(m);
        if (monthIdx === -1) return null;
        dt = new Date(Date.UTC(Number(y), monthIdx, Number(d)));
        hasYear = true;
    } else {
        // Try short date (no year)
        match = dateStr.match(/(\d{1,2})-([A-Za-z]{3})/);
        if (match) {
            const [, d, m] = match;
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const monthIdx = months.indexOf(m);
            if (monthIdx === -1) return null;
            const now = new Date();
            const y = now.getFullYear();
            dt = new Date(Date.UTC(y, monthIdx, Number(d)));
            // If date has already passed this year, assume next year
            const nowIST = new Date(now.getTime() + (330 - now.getTimezoneOffset()) * 60000);
            dt.setUTCHours(dt.getUTCHours() + 5, dt.getUTCMinutes() + 30);
            dt.setHours(0, 0, 0, 0);
            nowIST.setHours(0, 0, 0, 0);
            if (dt.getTime() < nowIST.getTime()) {
                dt.setFullYear(y + 1);
            }
        }
    }
    if (!dt) return null;
    // Offset to IST (UTC+5:30)
    dt.setUTCHours(dt.getUTCHours() + 5, dt.getUTCMinutes() + 30);
    const now = new Date();
    const nowIST = new Date(now.getTime() + (330 - now.getTimezoneOffset()) * 60000);
    dt.setHours(0, 0, 0, 0);
    nowIST.setHours(0, 0, 0, 0);
    // Only compare yearless dates within the same year window
    let diffDays = Math.round((dt.getTime() - nowIST.getTime()) / 86400000);
    // If the date is more than 180 days in the future, treat as next year error and recalc
    if (!hasYear && diffDays > 180) {
        dt.setFullYear(dt.getFullYear() - 1);
        diffDays = Math.round((dt.getTime() - nowIST.getTime()) / 86400000);
    }
    const dayName = dt.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'Asia/Kolkata' });
    return { diffDays, dayName };
}

// Color scale for date recency (future: accent, today: strong, past: neutral)
function getDateColorClass(diffDays: number, theme: string) {
    if (diffDays === 0) return theme === "dark" ? styles.dateTodayDark : styles.dateToday;
    if (diffDays > 0 && diffDays <= 2) return theme === "dark" ? styles.dateSoonDark : styles.dateSoon;
    if (diffDays < 0 && diffDays >= -2) return theme === "dark" ? styles.dateRecentDark : styles.dateRecent;
    if (diffDays > 2) return theme === "dark" ? styles.dateFutureDark : styles.dateFuture;
    return theme === "dark" ? styles.datePastDark : styles.datePast;
}

const DATE_COLUMNS = ["Open", "Close", "BoA Dt", "Listing"];

// Helper: is this a date value (e.g. 2-Jul, 30-Jun, 7-Jul, 10-Jul)
function isShortDate(val: string) {
    // Accepts d-MMM or dd-MMM (e.g. 2-Jul, 30-Jun)
    return /^\d{1,2}-[A-Za-z]{3}$/.test(val.trim());
}

// Helper: parse short date (e.g. 2-Jul) to Date (IST, this year or next if past)
function parseShortDate(val: string) {
    const match = val.trim().match(/(\d{1,2})-([A-Za-z]{3})/);
    if (!match) return null;
    const [, d, m] = match;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIdx = months.indexOf(m);
    if (monthIdx === -1) return null;
    const now = new Date();
    const y = now.getFullYear();
    // If date has already passed this year, assume next year
    const dt = new Date(Date.UTC(y, monthIdx, Number(d)));
    dt.setUTCHours(dt.getUTCHours() + 5, dt.getUTCMinutes() + 30);
    const nowIST = new Date(now.getTime() + (330 - now.getTimezoneOffset()) * 60000);
    dt.setHours(0, 0, 0, 0);
    nowIST.setHours(0, 0, 0, 0);
    if (dt.getTime() < nowIST.getTime()) {
        dt.setFullYear(y + 1);
    }
    const diffDays = Math.round((dt.getTime() - nowIST.getTime()) / 86400000);
    const dayName = dt.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'Asia/Kolkata' });
    return { diffDays, dayName, date: dt };
}

function renderDate(val: string) {
    // Prefer full date, else try short date
    const info = getRelativeDayInfo(val) || (isShortDate(val) ? parseShortDate(val) : null);
    if (info) {
        const theme = getCurrentTheme();
        const colorClass = getDateColorClass(info.diffDays, theme);
        let rel = "";
        if (info.diffDays === 0) rel = "Today";
        else if (info.diffDays === 1) rel = "Tomorrow";
        else if (info.diffDays === -1) rel = "Yesterday";
        else if (info.diffDays > 1) rel = `+${info.diffDays}d`;
        else if (info.diffDays < -1) rel = `${info.diffDays}d`;
        return (
            <span className={colorClass + ' ' + styles.dateEnhancedCell}>
                <span className={styles.dateMain}>{val}</span>
                <span className={styles.dateWeekday}>{info.dayName}</span>
                {rel && (
                    <span className={styles.dateRelative}>{rel}</span>
                )}
            </span>
        );
    }
    return val;
}

function getNameSuffixType(name: string) {
    if (!name) return null;
    const trimmed = name.trim();
    if (/\bU$/.test(trimmed)) return { type: "upcoming", label: "Upcoming" };
    if (/\bC$/.test(trimmed)) return { type: "close", label: "Close" };
    if (/\bO$/.test(trimmed)) return { type: "open", label: "Open" };
    return null;
}

// In renderNameCell, show badge always for U/C/O, and ensure .nameWithBadge is used in the Name column regardless of suffix.
function renderNameCell(val: string) {
    const suffix = getNameSuffixType(val);
    if (!suffix) return <span className={styles.nameWithBadge}>{val}</span>;
    return (
        <span className={styles.nameWithBadge}>
            {val.replace(/\b[UCO]$/, "").trim()}
            <span className={styles["nameBadge_" + suffix.type]} title={suffix.label}>{suffix.label.charAt(0)}</span>
        </span>
    );
}

const GMPTable: React.FC<GMPTableProps> = ({ headers, rows }) => {
    // Remove trailing empty columns (headers with empty string or only whitespace)
    const cleanHeaders = headers.filter(h => h.trim() !== "");
    // Detect if this is a GMP tab (not a performance tab)
    const isGmpTab = cleanHeaders.some(h => h.toLowerCase().includes("gmp"));
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
                                    if (
                                        isGmpTab && DATE_COLUMNS.some(col => header.toLowerCase().includes(col.toLowerCase())) && val
                                    ) {
                                        return <td key={header} className={styles.wrapCell}>{renderDate(val)}</td>;
                                    }
                                    if (/date/i.test(header) && val) return <td key={header} className={styles.wrapCell}>{val}</td>;
                                    if (/^name$/i.test(header)) return <td key={header} className={styles.wrapCell}>{renderNameCell(val)}</td>;
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
