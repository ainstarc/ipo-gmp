import React from "react";
import styles from "./styles/GMPTable.module.css";

interface GMPTableProps {
    headers: string[];
    rows: Record<string, string>[];
}

// Add sticky first column, row hover, and accessibility roles
const GMPTablePerf: React.FC<GMPTableProps> = React.memo(function GMPTablePerf({ headers, rows }) {
    const cleanHeaders = React.useMemo(() => headers.filter(h => h.trim() !== ""), [headers]);
    return (
        <div className={styles.tableWrapper}>
            <table className={styles.gmpTable} role="table" aria-label="IPO Performance Table">
                <thead>
                    <tr>
                        {cleanHeaders.map((header, idx) => (
                            <th
                                key={header}
                                className={styles.wrapCell + (idx === 0 ? ' ' + styles.stickyCol : '')}
                                scope="col"
                                aria-label={header.replace(/▲▼/, "").replace(/_/g, " ").trim()}
                            >
                                {header.replace(/▲▼/, "").replace(/_/g, " ").trim()}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i} className={(i % 2 === 0 ? styles.evenRow : styles.oddRow) + ' ' + styles.rowHover}>
                            {cleanHeaders.map((header, idx) => {
                                const val = row[header];
                                if (!val || val === "") return <td key={header} className={styles.wrapCell + (idx === 0 ? ' ' + styles.stickyCol : '')} role="cell">—</td>;
                                return <td key={header} className={styles.wrapCell + (idx === 0 ? ' ' + styles.stickyCol : '')} role="cell" title={val}>{val}</td>;
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});

export default GMPTablePerf;
