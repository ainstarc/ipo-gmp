import React from "react";
import styles from "./styles/GMPTable.module.css";

interface GMPTableProps {
    headers: string[];
    rows: Record<string, string>[];
}

// Helper to clean GMP value (keep only price, e.g., '₹18.54' from '₹18.54🔥Hot inbox')
function cleanGmpValue(val: string) {
    if (!val) return "";
    const match = val.match(/^₹?\d+[.,]?\d*/);
    return match ? match[0] : val;
}

// Method to render a header cell
function renderHeaderCell(header: string, idx: number) {
    return (
        <th
            key={header}
            className={styles.wrapCell + (idx === 0 ? ' ' + styles.stickyCol : '')}
            scope="col"
            aria-label={header.replace(/▲▼/, "").replace(/_/g, " ").trim()}
        >
            {header.replace(/▲▼/, "").replace(/_/g, " ").trim()}
        </th>
    );
}

// Method to render a table cell
function renderTableCell(row: Record<string, string>, header: string, idx: number) {
    let val = row[header];
    // If this is the GMP column, clean the value
    if (header.toLowerCase().includes("gmp")) {
        val = cleanGmpValue(val);
    }
    if (!val || val === "") return <td key={header} className={styles.wrapCell + (idx === 0 ? ' ' + styles.stickyCol : '')} role="cell">—</td>;
    return <td key={header} className={styles.wrapCell + (idx === 0 ? ' ' + styles.stickyCol : '')} role="cell" title={val}>{val}</td>;
}

// Method to render a table row
function renderTableRow(row: Record<string, string>, i: number, cleanHeaders: string[]) {
    return (
        <tr key={i} className={(i % 2 === 0 ? styles.evenRow : styles.oddRow) + ' ' + styles.rowHover}>
            {cleanHeaders.map((header, idx) => renderTableCell(row, header, idx))}
        </tr>
    );
}

// Add sticky first column, row hover, and accessibility roles
const GMPTablePerf: React.FC<GMPTableProps> = React.memo(function GMPTablePerf({ headers, rows }) {
    const cleanHeaders = React.useMemo(() => headers.filter(h => h.trim() !== ""), [headers]);
    return (
        <div className={styles.tableWrapper}>
            <table className={styles.gmpTable} role="table" aria-label="IPO Performance Table">
                <thead>
                    <tr>
                        {cleanHeaders.map(renderHeaderCell)}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => renderTableRow(row, i, cleanHeaders))}
                </tbody>
            </table>
        </div>
    );
});

export default GMPTablePerf;
