// src/utils/parseGmpJson.ts

export interface GMPReport {
  title: string;
  data: Record<string, string>[];
}

/**
 * Parses the raw JSON from gmp.json and returns an array of GMPReport objects.
 * This function can be updated if the JSON structure changes in the future.
 */
export function parseGmpJson(raw: any): GMPReport[] {
  const reports: GMPReport[] = [];
  if (raw && Array.isArray(raw.allGMP)) {
    reports.push({ title: "All GMP", data: raw.allGMP });
  }
  if (raw && Array.isArray(raw.currentGMP)) {
    reports.push({ title: "Current Market GMP", data: raw.currentGMP });
  }
  if (raw && Array.isArray(raw.mainboardGMP)) {
    reports.push({ title: "Mainboard GMP", data: raw.mainboardGMP });
  }
  if (raw && Array.isArray(raw.smeGMP)) {
    reports.push({ title: "SME GMP", data: raw.smeGMP });
  }
  if (raw && Array.isArray(raw.allPerf)) {
    reports.push({ title: "All IPO Performance", data: raw.allPerf });
  }
  if (raw && Array.isArray(raw.mainlinePerf)) {
    reports.push({ title: "Mainline IPO Performance", data: raw.mainlinePerf });
  }
  if (raw && Array.isArray(raw.smePerf)) {
    reports.push({ title: "SME IPO Performance", data: raw.smePerf });
  }
  return reports;
}
