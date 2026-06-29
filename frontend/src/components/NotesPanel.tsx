import { useCallback, useEffect, useState } from "react";

import { createNote, deleteNote, fetchNotes, updateNote } from "../api/notes";
import type { Application } from "../types/application";
import {
  NOTE_TYPES,
  type Note,
  type NoteCreateInput,
  type NoteType,
  type NoteUpdateInput,
} from "../types/note";
import { toDatetimeLocalValue } from "../utils/datetime";
import { formatEnumLabel } from "../utils/format";

interface NoteFormState {
  note_type: NoteType;
  content: string;
  event_at: string;
  interview_completed: boolean;
}

const EMPTY_NOTE_FORM: NoteFormState = {
  note_type: "general",
  content: "",
  event_at: "",
  interview_completed: false,
};

function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formFromNote(note: Note): NoteFormState {
  return {
    note_type: note.note_type,
    content: note.content,
    event_at: toDatetimeLocalValue(note.event_at),
    interview_completed: note.interview_completed ?? false,
  };
}

function buildCreatePayload(form: NoteFormState): NoteCreateInput {
  const payload: NoteCreateInput = {
    note_type: form.note_type,
    content: form.content.trim(),
  };

  if (form.event_at.trim()) {
    payload.event_at = new Date(form.event_at).toISOString();
  }

  if (form.note_type === "interview") {
    payload.interview_completed = form.interview_completed;
  }

  return payload;
}

function buildUpdatePayload(form: NoteFormState, initial: Note): NoteUpdateInput {
  const payload: NoteUpdateInput = {};

  if (form.note_type !== initial.note_type) payload.note_type = form.note_type;
  if (form.content.trim() !== initial.content) payload.content = form.content.trim();

  const initialEventAt = toDatetimeLocalValue(initial.event_at);
  if (form.event_at.trim() !== initialEventAt) {
    payload.event_at = form.event_at.trim()
      ? new Date(form.event_at).toISOString()
      : null;
  }

  const effectiveType = form.note_type;
  if (effectiveType === "interview") {
    const initialCompleted = initial.interview_completed ?? false;
    if (form.interview_completed !== initialCompleted) {
      payload.interview_completed = form.interview_completed;
    }
  } else if (initial.interview_completed !== null) {
    payload.interview_completed = null;
  }

  return payload;
}

interface NotesPanelProps {
  application: Application | null;
}

export function NotesPanel({ application }: NotesPanelProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [form, setForm] = useState<NoteFormState>(EMPTY_NOTE_FORM);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const loadNotes = useCallback(async (applicationId: string) => {
    setLoading(true);
    setListError(null);

    try {
      const data = await fetchNotes(applicationId);
      setNotes(data.items);
    } catch (err) {
      setNotes([]);
      setListError(err instanceof Error ? err.message : "Failed to load notes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!application) {
      setNotes([]);
      setListError(null);
      setEditingNote(null);
      setForm(EMPTY_NOTE_FORM);
      setFormError(null);
      setFieldErrors({});
      return;
    }

    setEditingNote(null);
    setForm(EMPTY_NOTE_FORM);
    setFormError(null);
    setFieldErrors({});
    void loadNotes(application.id);
  }, [application, loadNotes]);

  function resetForm() {
    setEditingNote(null);
    setForm(EMPTY_NOTE_FORM);
    setFormError(null);
    setFieldErrors({});
  }

  function updateField<K extends keyof NoteFormState>(key: K, value: NoteFormState[K]) {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "note_type" && value !== "interview") {
        next.interview_completed = false;
      }
      return next;
    });
  }

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!form.content.trim()) errors.content = "Required";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!application || !validate()) return;

    setSubmitting(true);
    setFormError(null);

    try {
      if (editingNote) {
        const payload = buildUpdatePayload(form, editingNote);
        if (Object.keys(payload).length === 0) {
          resetForm();
          return;
        }
        await updateNote(editingNote.id, payload);
      } else {
        await createNote(application.id, buildCreatePayload(form));
      }

      resetForm();
      await loadNotes(application.id);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save note");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(note: Note) {
    if (!application) return;
    if (!window.confirm("Delete this note?")) return;

    try {
      await deleteNote(note.id);
      if (editingNote?.id === note.id) resetForm();
      await loadNotes(application.id);
    } catch (err) {
      setListError(err instanceof Error ? err.message : "Failed to delete note");
    }
  }

  if (!application) {
    return (
      <aside className="notes-panel">
        <h2>Notes</h2>
        <p className="notes-placeholder">Select an application to view notes.</p>
      </aside>
    );
  }

  return (
    <aside className="notes-panel">
      <header className="notes-panel-header">
        <div>
          <h2>Notes</h2>
          <p className="notes-subtitle">
            {application.company_name} — {application.position}
          </p>
        </div>
        {editingNote && (
          <button type="button" className="btn btn-secondary btn-sm" onClick={resetForm}>
            New note
          </button>
        )}
      </header>

      {loading && <p className="status-message">Loading notes…</p>}
      {listError && <p className="status-message error">{listError}</p>}

      {!loading && !listError && notes.length === 0 && (
        <p className="notes-empty">No notes yet for this application.</p>
      )}

      {!loading && notes.length > 0 && (
        <ul className="notes-list">
          {notes.map((note) => (
            <li
              key={note.id}
              className={editingNote?.id === note.id ? "note-item editing" : "note-item"}
            >
              <div className="note-item-header">
                <span className="note-type-badge">{formatEnumLabel(note.note_type)}</span>
                {note.note_type === "interview" && (
                  <span className="note-meta">
                    {note.interview_completed ? "Completed" : "Scheduled"}
                  </span>
                )}
              </div>
              {note.event_at && (
                <p className="note-meta">Event: {formatDateTime(note.event_at)}</p>
              )}
              <p className="note-content">{note.content}</p>
              <div className="note-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setEditingNote(note);
                    setForm(formFromNote(note));
                    setFormError(null);
                    setFieldErrors({});
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => void handleDelete(note)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form className="note-form" onSubmit={handleSubmit}>
        <h3>{editingNote ? "Edit note" : "Add note"}</h3>

        <label>
          Note type *
          <select
            value={form.note_type}
            onChange={(event) =>
              updateField("note_type", event.target.value as NoteType)
            }
          >
            {NOTE_TYPES.map((type) => (
              <option key={type} value={type}>
                {formatEnumLabel(type)}
              </option>
            ))}
          </select>
        </label>

        <label>
          Content *
          <textarea
            rows={4}
            value={form.content}
            onChange={(event) => updateField("content", event.target.value)}
          />
          {fieldErrors.content && (
            <span className="field-error">{fieldErrors.content}</span>
          )}
        </label>

        <label>
          Event at
          <input
            type="datetime-local"
            value={form.event_at}
            onChange={(event) => updateField("event_at", event.target.value)}
          />
        </label>

        {form.note_type === "interview" && (
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={form.interview_completed}
              onChange={(event) =>
                updateField("interview_completed", event.target.checked)
              }
            />
            Interview completed
          </label>
        )}

        {formError && <p className="status-message error">{formError}</p>}

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving…" : editingNote ? "Save note" : "Add note"}
        </button>
      </form>
    </aside>
  );
}
