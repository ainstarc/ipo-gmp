import React from "react";
import styles from "./styles/GMPTable.module.css";

interface GMPTableProps {
    headers: string[];
    rows: Record<string, string>[];
}

const GMPTablePerf: React.FC<GMPTableProps> = ({ headers, rows }) => {
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

export default GMPTablePerf;
