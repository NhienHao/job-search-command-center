export async function parseApiError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    if (typeof data.detail === "string") {
      return data.detail;
    }
    if (Array.isArray(data.detail)) {
      return data.detail
        .map((item: { msg?: string }) => item.msg ?? "Validation error")
        .join("; ");
    }
  } catch {
    // ignore JSON parse errors
  }
  return `Request failed (${response.status})`;
}
