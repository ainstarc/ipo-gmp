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

  function getArray<T = Record<string, string>>(
    obj: Record<string, unknown>,
    key: string
  ): T[] | undefined {
    const arr = obj[key];
    return Array.isArray(arr) ? (arr as T[]) : undefined;
  }

  const allGMP = getArray(raw, "allGMP");
  if (allGMP) reports.push({ title: "All GMP", data: allGMP });

  const currentGMP = getArray(raw, "currentGMP");
  if (currentGMP)
    reports.push({ title: "Current Market GMP", data: currentGMP });

  const smeGMP = getArray(raw, "smeGMP");
  if (smeGMP) reports.push({ title: "SME GMP", data: smeGMP });

  const allSub = getArray(raw, "allSub");
  if (allSub) reports.push({ title: "All Subscriptions", data: allSub });

  const allPerf = getArray(raw, "allPerf");
  if (allPerf) reports.push({ title: "All IPO Performance", data: allPerf });

  return reports;
}
