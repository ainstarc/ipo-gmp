// src/utils/parseGmpJson.ts

export interface GMPReport {
  title: string;
  data: Record<string, string>[];
}

/**
 * Parses the raw JSON from gmp.json and returns an array of GMPReport objects.
 * This function can be updated if the JSON structure changes in the future.
 */
export function parseGmpJson(raw: Record<string, unknown>): GMPReport[] {
  const reports: GMPReport[] = [];
  if (raw && Array.isArray((raw as any).allGMP)) {
    reports.push({ title: "All GMP", data: (raw as any).allGMP });
  }
  if (raw && Array.isArray((raw as any).currentGMP)) {
    reports.push({
      title: "Current Market GMP",
      data: (raw as any).currentGMP,
    });
  }
  if (raw && Array.isArray((raw as any).mainboardGMP)) {
    reports.push({ title: "Mainboard GMP", data: (raw as any).mainboardGMP });
  }
  if (raw && Array.isArray((raw as any).smeGMP)) {
    reports.push({ title: "SME GMP", data: (raw as any).smeGMP });
  }
  if (raw && Array.isArray((raw as any).allPerf)) {
    reports.push({ title: "All IPO Performance", data: (raw as any).allPerf });
  }
  if (raw && Array.isArray((raw as any).mainlinePerf)) {
    reports.push({
      title: "Mainline IPO Performance",
      data: (raw as any).mainlinePerf,
    });
  }
  if (raw && Array.isArray((raw as any).smePerf)) {
    reports.push({ title: "SME IPO Performance", data: (raw as any).smePerf });
  }
  return reports;
}
