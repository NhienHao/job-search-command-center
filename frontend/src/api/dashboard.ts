import { getApiBaseUrl } from "./client";
import { parseApiError } from "./errors";
import { mapDashboardSummary, type DashboardSummary } from "../types/dashboard";

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const response = await fetch(`${getApiBaseUrl()}/api/dashboard/summary`);

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  const data = await response.json();
  return mapDashboardSummary(data);
}
