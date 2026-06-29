import { getApiBaseUrl } from "./client";
import { parseApiError } from "./errors";
import type {
  Application,
  ApplicationCreateInput,
  ApplicationFilterParams,
  ApplicationListResponse,
  ApplicationUpdateInput,
} from "../types/application";

function buildQuery(params: ApplicationFilterParams): string {
  const search = new URLSearchParams();

  if (params.status) search.set("status", params.status);
  if (params.company?.trim()) search.set("company", params.company.trim());
  if (params.position?.trim()) search.set("position", params.position.trim());
  if (params.source?.trim()) search.set("source", params.source.trim());
  if (params.sort) search.set("sort", params.sort);
  if (params.order) search.set("order", params.order);

  const query = search.toString();
  return query ? `?${query}` : "";
}

export async function fetchApplications(
  params: ApplicationFilterParams = {},
): Promise<ApplicationListResponse> {
  const response = await fetch(
    `${getApiBaseUrl()}/api/applications${buildQuery(params)}`,
  );

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json();
}

export async function createApplication(
  data: ApplicationCreateInput,
): Promise<Application> {
  const response = await fetch(`${getApiBaseUrl()}/api/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json();
}

export async function updateApplication(
  id: string,
  data: ApplicationUpdateInput,
): Promise<Application> {
  const response = await fetch(`${getApiBaseUrl()}/api/applications/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json();
}
