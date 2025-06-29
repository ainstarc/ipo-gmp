import React, { useState } from "react";
import GMPTableGmp from "./GMPTableGmp";

interface QueryTableProps {
    headers: string[];
    rows: Record<string, string>[];
}

/**
 * QueryTable allows users to filter the table using a simple query language.
 * Example queries:
 *   - GMP >= 20
 *   - Fire Rating = 3
 *   - Name includes "SME"
 *   - Close = "30-Jun"
 *   - (GMP >= 20) and (Fire Rating >= 3)
 *
 * Schema fields: Name, GMP, Fire Rating, Open, Close, Listing, board, etc.
 */
const QueryTable: React.FC<QueryTableProps> = ({ headers, rows }) => {
    const [query, setQuery] = useState("");
    const [filteredRows, setFilteredRows] = useState(rows);

    function parseQuery(q: string): (row: Record<string, string>) => boolean {
        // Map normalized field names to actual keys in the data
        const fieldMap: Record<string, string> = {};
        headers.forEach(h => {
            const norm = h.replace(/[▲▼]/g, '').trim().toLowerCase();
            fieldMap[norm] = h;
        });
        // Supports 'FIELD OP VALUE' and 'and' (case-insensitive)
        // e.g. GMP >= 20 and Fire Rating >= 3
        const clauses = q.split(/\s+and\s+/i).map(s => s.trim()).filter(Boolean);
        console.log('[QueryTable] Parsed clauses: ', clauses);
        return (row) => {
            for (const clause of clauses) {
                // Support badge queries: Name endswith U/O/C/L
                const badgeMatch = clause.match(/^Name\s+endswith\s+([UOCL])$/i);
                if (badgeMatch) {
                    const nameKey = fieldMap['name'] || 'Name';
                    const name = (row[nameKey] || "").trim();
                    const result = !!name.match(new RegExp(badgeMatch[1] + "$", "i"));
                    console.log('[QueryTable] Badge clause:', clause, 'Name:', name, 'Result:', result);
                    if (!result) return false;
                    continue;
                }
                // Standard clause
                const match = clause.match(/^(\w[\w\s]+?)\s*(=|>=|<=|>|<|includes)\s*"?([^"]+)"?$/i);
                if (!match) return true; // ignore invalid clause
                const [, fieldRaw, op, value] = match;
                const fieldNorm = fieldRaw.trim().toLowerCase();
                const field = fieldMap[fieldNorm] || fieldRaw.trim();
                let cell = row[field] || "";
                // Special handling for GMP and Fire Rating
                if (fieldNorm === "gmp") {
                    // Extract percent if present
                    const percentMatch = cell.match(/([+-]?\d+\.?\d*)%/);
                    cell = percentMatch ? percentMatch[1] : cell.replace(/[^\d.-]+/g, "");
                }
                if (fieldNorm === "fire rating") {
                    // Extract number from '3 🔥' or count emojis
                    const numMatch = cell.match(/(\d+)/);
                    if (numMatch) cell = numMatch[1];
                    else cell = String((cell.match(/🔥/g) || []).length);
                }
                console.log('[QueryTable] Row:', row, 'Field:', field, 'Cell:', cell);
                if (op === "includes") {
                    const result = cell.toLowerCase().includes(value.toLowerCase());
                    console.log('[QueryTable] Clause:', clause, 'Field:', field, 'Cell:', cell, 'Op:', op, 'Value:', value, 'Result:', result);
                    if (!result) return false;
                } else if ([">=", "<=", ">", "<", "="].includes(op)) {
                    // Try to parse as number, else compare as string
                    const numCell = parseFloat(cell);
                    const numValue = parseFloat(value);
                    if (!isNaN(numCell) && !isNaN(numValue)) {
                        let result = true;
                        if (op === ">=" && !(numCell >= numValue)) result = false;
                        if (op === "<=" && !(numCell <= numValue)) result = false;
                        if (op === ">" && !(numCell > numValue)) result = false;
                        if (op === "<" && !(numCell < numValue)) result = false;
                        if (op === "=" && !(numCell === numValue)) result = false;
                        console.log('[QueryTable] Clause:', clause, 'Field:', field, 'Cell:', cell, 'Op:', op, 'Value:', value, 'Result:', result);
                        if (!result) return false;
                    } else {
                        // fallback to string compare
                        const result = op === "=" && cell.trim() === value.trim();
                        console.log('[QueryTable] Clause:', clause, 'Field:', field, 'Cell:', cell, 'Op:', op, 'Value:', value, 'Result:', result);
                        if (!result) return false;
                    }
                }
            }
            return true;
        };
    }

    function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
        const q = e.target.value;
        setQuery(q);
        if (!q.trim()) {
            setFilteredRows(rows);
            return;
        }
        try {
            const filterFn = parseQuery(q);
            setFilteredRows(rows.filter(filterFn));
        } catch {
            setFilteredRows(rows);
        }
    }

    React.useEffect(() => {
        if (process.env.NODE_ENV !== "development") return;
        if (!rows.length) return;
        const testQueries = [
            "GMP >= 20",
            "Fire Rating = 3",
            "Name includes SME",
            "Close = 30-Jun",
            "Name endswith U",
            "GMP >= 20 and Fire Rating >= 3"
        ];
        for (const tq of testQueries) {
            const filterFn = parseQuery(tq);
            const result = rows.filter(filterFn);

            console.log(`[QueryTable TEST] Query: '${tq}' matched ${result.length} rows.`);
        }
    }, [rows]);

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <label style={{ fontWeight: 700, letterSpacing: "0.08em", color: "#007a3d", textTransform: "uppercase" }}>
                    Query Table (see guide below):
                    <input
                        type="text"
                        value={query}
                        onChange={handleQueryChange}
                        placeholder="e.g. GMP >= 20 and Fire Rating >= 3"
                        style={{ marginLeft: 12, minWidth: 320, fontSize: 16, padding: 6, borderRadius: 6, border: "1px solid #ccc" }}
                    />
                </label>
                <div style={{ fontSize: 13, color: "#888", marginTop: 8, lineHeight: 1.5 }}>
                    <b>Schema fields:</b> Name, GMP, Fire Rating, Open, Close, Listing, board, etc.<br />
                    <b>Operators:</b> =, &gt;=, &lt;=, &gt;, &lt;, includes, <b>endswith</b> (for badge: U/O/C/L)<br />
                    <b>Examples:</b> GMP &gt;= 20, Fire Rating = 3, Name includes &quot;SME&quot;, Close = &quot;30-Jun&quot;, Name endswith U, (GMP &gt;= 20) and (Fire Rating &gt;= 3)
                </div>
            </div>
            <div style={{ fontWeight: 600, color: '#007a3d', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Showing {filteredRows.length} row{filteredRows.length === 1 ? '' : 's'}
            </div>
            <GMPTableGmp headers={headers} rows={filteredRows} />
        </div>
    );
};

export default QueryTable;
