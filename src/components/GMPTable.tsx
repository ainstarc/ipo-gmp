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

function renderGmpValue(val: string) {
    const cleaned = cleanGmpValue(val);
    if (!cleaned || cleaned === "--" || cleaned === "₹-- (0.00%)" || cleaned === "0.00%") {
        return <span className={styles.gmpNeutral}>—</span>;
    }
    if (/[-+]?[0-9]+(\.[0-9]+)?%/.test(cleaned) || /\([+-]?[0-9.]+%\)/.test(cleaned) || /\+/.test(cleaned)) {
        if (cleaned.includes("-") || cleaned.includes("-0")) return <span className={styles.gmpNegative}>{cleaned}</span>;
        if (cleaned.includes("+") || (cleaned.includes("(") && cleaned.includes("%"))) return <span className={styles.gmpPositive}>{cleaned}</span>;
        return <span className={styles.gmpNeutral}>{cleaned}</span>;
    }
    return cleaned;
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
                    {rows.map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? styles.evenRow : styles.oddRow}>
                            {cleanHeaders.map((header) => {
                                const val = row[header];
                                if (/fire/i.test(header)) return <td key={header} className={styles.wrapCell}>{renderFire(val)}</td>;
                                if (/gmp/i.test(header) || /%/.test(val || "")) return <td key={header} className={styles.wrapCell}>{renderGmpValue(val)}</td>;
                                if (/date/i.test(header) && val) return <td key={header} className={styles.wrapCell}>{renderDate(val)}</td>;
                                if (!val || val === "") return <td key={header} className={styles.wrapCell}>—</td>;
                                return <td key={header} className={styles.wrapCell}>{val}</td>;
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GMPTable;
