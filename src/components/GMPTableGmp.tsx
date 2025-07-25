import React, { useState } from "react";
import styles from "./styles/GMPTable.module.css";

function cleanGmpValue(val: string) {
    if (!val) return "";
    return val.replace(/🔥.*$/g, "").replace(/Hot inbox/gi, "").trim();
}
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
    const count = (val.match(/🔥/g) || []).length;
    if (count > 0) {
        let badgeClass = styles.fireBadge;
        if (count === 3) badgeClass += ' ' + styles.fireBadge3;
        else if (count === 4) badgeClass += ' ' + styles.fireBadge4;
        else if (count >= 5) badgeClass += ' ' + styles.fireBadge5;
        return <span className={badgeClass}>{count} 🔥</span>;
    }
    return val;
}
function renderGmpValue(val: string) {
    const cleaned = cleanGmpValue(val);
    if (!cleaned || cleaned === "--" || cleaned === "₹-- (0.00%)" || cleaned === "0.00%") {
        return <span className={styles.gmpTextNeutral}>—</span>;
    }
    const match = cleaned.match(/([+-]?\d+\.?\d*)%/);
    if (match) {
        const percent = parseFloat(match[1]);
        const theme = getCurrentTheme();
        const colorClass = getGmpColorClass(percent, theme);
        const dotStyle = { background: getGmpHeatDotColor(percent, theme) };
        return <span><span className={styles.gmpHeatDot} style={dotStyle}></span><span className={colorClass}>{cleaned}</span></span>;
    }
    return <span className={styles.gmpTextNeutral}>{cleaned}</span>;
}
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
function getFireCount(row: Record<string, string>, headers: string[]): number {
    const fireHeader = headers.find(h => /fire/i.test(h));
    if (!fireHeader) return 0;
    const val = row[fireHeader] || "";
    return (val.match(/🔥/g) || []).length;
}
function getFireRowClass(fireCount: number) {
    if (fireCount >= 3) return styles.fireRow3;
    if (fireCount === 2) return styles.fireRow2;
    if (fireCount === 1) return styles.fireRow1;
    return "";
}
function getRelativeDayInfo(dateStr: string) {
    let dt: Date | null = null;
    let hasYear = false;
    let match = dateStr.match(/(\d{1,2})-([A-Za-z]{3})-(\d{4})/);
    if (match) {
        const [, d, m, y] = match;
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthIdx = months.indexOf(m);
        if (monthIdx === -1) return null;
        dt = new Date(Date.UTC(Number(y), monthIdx, Number(d)));
        hasYear = true;
    } else {
        match = dateStr.match(/(\d{1,2})-([A-Za-z]{3})/);
        if (match) {
            const [, d, m] = match;
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const monthIdx = months.indexOf(m);
            if (monthIdx === -1) return null;
            const now = new Date();
            const y = now.getFullYear();
            dt = new Date(Date.UTC(y, monthIdx, Number(d)));
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
    dt.setUTCHours(dt.getUTCHours() + 5, dt.getUTCMinutes() + 30);
    const now = new Date();
    const nowIST = new Date(now.getTime() + (330 - now.getTimezoneOffset()) * 60000);
    dt.setHours(0, 0, 0, 0);
    nowIST.setHours(0, 0, 0, 0);
    let diffDays = Math.round((dt.getTime() - nowIST.getTime()) / 86400000);
    if (!hasYear && diffDays > 180) {
        dt.setFullYear(dt.getFullYear() - 1);
        diffDays = Math.round((dt.getTime() - nowIST.getTime()) / 86400000);
    }
    const dayName = dt.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'Asia/Kolkata' });
    return { diffDays, dayName };
}
function getDateColorClass(diffDays: number, theme: string) {
    if (diffDays === 0) return theme === "dark" ? styles.dateTodayDark : styles.dateToday;
    if (diffDays > 0 && diffDays <= 2) return theme === "dark" ? styles.dateSoonDark : styles.dateSoon;
    if (diffDays < 0 && diffDays >= -2) return theme === "dark" ? styles.dateRecentDark : styles.dateRecent;
    if (diffDays > 2) return theme === "dark" ? styles.dateFutureDark : styles.dateFuture;
    return theme === "dark" ? styles.datePastDark : styles.datePast;
}
const DATE_COLUMNS = ["Open", "Close", "BoA Dt", "Listing"];
function isShortDate(val: string) {
    return /^\d{1,2}-[A-Za-z]{3}$/.test(val.trim());
}
function parseShortDate(val: string) {
    const match = val.trim().match(/(\d{1,2})-([A-Za-z]{3})/);
    if (!match) return null;
    const [, d, m] = match;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIdx = months.indexOf(m);
    if (monthIdx === -1) return null;
    const now = new Date();
    const y = now.getFullYear();
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
    if (/L@/i.test(trimmed)) return { type: "listing", label: "Listing" };
    if (/\bCT$/.test(trimmed)) return { type: "closing_today", label: "Closing Today" };
    if (/\bC$/.test(trimmed) && !/\bCT$/.test(trimmed)) return { type: "close", label: "Close" };
    if (/\bU$/.test(trimmed)) return { type: "upcoming", label: "Upcoming" };
    if (/\bO$/.test(trimmed)) return { type: "open", label: "Open" };
    return null;
}
function renderNameCell(val: string) {
    const suffix = getNameSuffixType(val);
    if (!suffix) return <span className={styles.nameWithBadge}>{val}</span>;
    let displayName = val;
    if (suffix.type === "listing") {
        // Remove L@... from display name, keep badge
        displayName = val.replace(/L@[^\s]+(\s*\([^)]*\))?/, "").trim();
    } else if (suffix.type === "closing_today") {
        displayName = val.replace(/\bCT$/, "").trim();
    } else if (suffix.type === "close") {
        displayName = val.replace(/\bC$/, "").trim();
    } else if (suffix.type === "upcoming") {
        displayName = val.replace(/\bU$/, "").trim();
    } else if (suffix.type === "open") {
        displayName = val.replace(/\bO$/, "").trim();
    }
    // Show 'CT' for closing_today, otherwise first letter of label
    const badgeText = suffix.type === "closing_today" ? "CT" : suffix.label.charAt(0);
    return (
        <span className={styles.nameWithBadge}>
            {displayName}
            <span className={styles["nameBadge_" + suffix.type]} title={suffix.label}>{badgeText}</span>
        </span>
    );
}
const COMPACT_COLUMNS = [
    "Name", "GMP", "Fire Rating", "Open", "Close", "Listing"
];
const HIGHLY_COMPACT_COLUMNS = [
    "Name", "GMP", "Close", "Listing"
];

// Render header cell
function renderHeaderCell(header: string, viewMode: string) {
    let thClass = styles.wrapCell;
    if (viewMode !== 'expanded') {
        const colKey = header.toLowerCase().replace(/\s+/g, '-');
        thClass += ' ' + styles['col_' + colKey];
    }
    return (
        <th key={header} className={thClass}>{header.replace(/▲▼/, "").replace(/_/g, " ").trim()}</th>
    );
}

// Render table cell
function renderTableCell(row: Record<string, string>, header: string, viewMode: string) {
    const val = row[header];
    let tdClass = styles.wrapCell;
    if (viewMode !== 'expanded') {
        const colKey = header.toLowerCase().replace(/\s+/g, '-');
        tdClass += ' ' + styles['col_' + colKey];
    }
    if (/fire/i.test(header)) return <td key={header} className={tdClass}>{renderFire(val)}</td>;
    if (/gmp/i.test(header) || (/%/.test(val || "") && !/name/i.test(header))) return <td key={header} className={tdClass}>{renderGmpValue(val)}</td>;
    if (DATE_COLUMNS.some(col => header.toLowerCase().includes(col.toLowerCase())) && val) {
        return <td key={header} className={tdClass}>{renderDate(val)}</td>;
    }
    if (/date/i.test(header) && val) return <td key={header} className={tdClass}>{val}</td>;
    if (header.toLowerCase().includes("name")) return <td key={header} className={tdClass}>{renderNameCell(val)}</td>;
    if (!val || val === "") return <td key={header} className={tdClass}>—</td>;
    return <td key={header} className={tdClass}>{val}</td>;
}

// Render table row
function renderTableRow(row: Record<string, string>, i: number, cleanHeaders: string[], visibleHeaders: string[], viewMode: string) {
    const fireCount = getFireCount(row, cleanHeaders);
    const fireClass = getFireRowClass(fireCount);
    return (
        <tr key={i} className={`${i % 2 === 0 ? styles.evenRow : styles.oddRow} ${fireClass}`}>
            {visibleHeaders.map((header) => renderTableCell(row, header, viewMode))}
        </tr>
    );
}

interface GMPTableProps {
    headers: string[];
    rows: Record<string, string>[];
}

const GMPTableGmp: React.FC<GMPTableProps> = ({ headers, rows }) => {
    const cleanHeaders = headers.filter(h => h.trim() !== "");
    const [viewMode, setViewMode] = useState<'expanded' | 'compact' | 'highly_compact'>('expanded');
    let visibleHeaders = cleanHeaders;
    if (viewMode === 'compact') {
        visibleHeaders = cleanHeaders.filter(h => COMPACT_COLUMNS.some(c => h.toLowerCase().includes(c.toLowerCase())));
    } else if (viewMode === 'highly_compact') {
        visibleHeaders = cleanHeaders.filter(h => HIGHLY_COMPACT_COLUMNS.some(c => h.toLowerCase().includes(c.toLowerCase())));
    }
    return (
        <div className={styles.tableWrapper}>
            <div className={styles.toggleBar}>
                <button className={viewMode === 'expanded' ? styles.toggleBtnActive : styles.toggleBtn} onClick={() => setViewMode('expanded')} aria-pressed={viewMode === 'expanded'}>Expanded</button>
                <button className={viewMode === 'compact' ? styles.toggleBtnActive : styles.toggleBtn} onClick={() => setViewMode('compact')} aria-pressed={viewMode === 'compact'}>Compact</button>
                <button className={viewMode === 'highly_compact' ? styles.toggleBtnActive : styles.toggleBtn} onClick={() => setViewMode('highly_compact')} aria-pressed={viewMode === 'highly_compact'}>Highly Compact</button>
            </div>
            <table className={styles.gmpTable + (viewMode !== 'expanded' ? ' ' + styles.compactTable : '') + (viewMode === 'highly_compact' ? ' ' + styles.highlyCompactTable : '')}>
                <thead>
                    <tr>
                        {visibleHeaders.map(header => renderHeaderCell(header, viewMode))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => renderTableRow(row, i, cleanHeaders, visibleHeaders, viewMode))}
                </tbody>
            </table>
        </div>
    );
};

export default GMPTableGmp;
