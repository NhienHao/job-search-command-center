export const NOTE_TYPES = [
  "apply",
  "interview",
  "question",
  "feedback",
  "general",
] as const;

export type NoteType = (typeof NOTE_TYPES)[number];

export interface Note {
  id: string;
  application_id: string;
  note_type: NoteType;
  content: string;
  event_at: string | null;
  interview_completed: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface NoteListResponse {
  items: Note[];
  total: number;
}

export interface NoteCreateInput {
  note_type: NoteType;
  content: string;
  event_at?: string | null;
  interview_completed?: boolean | null;
}

export type NoteUpdateInput = Partial<NoteCreateInput>;
