import React from "react";
import styles from "./styles/GMPTable.module.css";

interface GMPTableProps {
    headers: string[];
    rows: Record<string, string>[];
}

const getGmpClass = (gmp: string) => {
    if (gmp.startsWith("+")) return styles.gmpPositive;
    if (gmp.startsWith("-")) return styles.gmpNegative;
    return styles.gmpNeutral;
};

const GMPTable: React.FC<GMPTableProps> = ({ headers, rows }) => {
    return (
        <div className={styles.tableWrapper}>
            <table className={styles.gmpTable}>
                <thead>
                    <tr>
                        {headers.map((header) => (
                            <th key={header}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? styles.evenRow : styles.oddRow}>
                            {headers.map((header) => (
                                <td
                                    key={header}
                                    className={
                                        header.toLowerCase() === "gmp" && row[header]
                                            ? getGmpClass(row[header])
                                            : undefined
                                    }
                                >
                                    {row[header]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GMPTable;
