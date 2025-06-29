import React from "react";
import GMPTableGmp from "./GMPTableGmp";
import GMPTablePerf from "./GMPTablePerf";

// Helper: is this a GMP tab? (should be based on the tab title, not headers)
function isGmpTabByTitle(title: string): boolean {
    // Only treat as GMP if the tab title contains 'GMP' (not 'Performance' or 'Perf')
    return /gmp/i.test(title) && !/performance|perf/i.test(title);
}

interface GMPTableProps {
    headers: string[];
    rows: Record<string, string>[];
    title: string; // Require title prop for tab context
}

const GMPTable: React.FC<GMPTableProps> = ({ headers, rows, title }) => {
    if (isGmpTabByTitle(title)) {
        return <GMPTableGmp headers={headers} rows={rows} />;
    } else {
        return <GMPTablePerf headers={headers} rows={rows} />;
    }
};

export default GMPTable;
