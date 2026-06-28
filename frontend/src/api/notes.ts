import { getApiBaseUrl } from "./client";
import { parseApiError } from "./errors";
import type {
  Note,
  NoteCreateInput,
  NoteListResponse,
  NoteUpdateInput,
} from "../types/note";

export async function fetchNotes(applicationId: string): Promise<NoteListResponse> {
  const response = await fetch(
    `${getApiBaseUrl()}/api/applications/${applicationId}/notes`,
  );

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json();
}

export async function createNote(
  applicationId: string,
  data: NoteCreateInput,
): Promise<Note> {
  const response = await fetch(
    `${getApiBaseUrl()}/api/applications/${applicationId}/notes`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json();
}

export async function updateNote(id: string, data: NoteUpdateInput): Promise<Note> {
  const response = await fetch(`${getApiBaseUrl()}/api/notes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json();
}

export async function deleteNote(id: string): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/api/notes/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }
}
