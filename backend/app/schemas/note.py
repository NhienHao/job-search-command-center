from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.models.application_note import NoteType


class NoteCreate(BaseModel):
    note_type: NoteType
    content: str = Field(min_length=1)
    event_at: datetime | None = None
    interview_completed: bool | None = None

    @model_validator(mode="after")
    def validate_interview_completed(self) -> "NoteCreate":
        if self.note_type != NoteType.interview and self.interview_completed is not None:
            raise ValueError(
                "interview_completed can only be set when note_type is interview"
            )
        return self


class NoteUpdate(BaseModel):
    note_type: NoteType | None = None
    content: str | None = Field(default=None, min_length=1)
    event_at: datetime | None = None
    interview_completed: bool | None = None


class NoteResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    application_id: UUID
    note_type: NoteType
    content: str
    event_at: datetime | None
    interview_completed: bool | None
    created_at: datetime
    updated_at: datetime


class NoteListResponse(BaseModel):
    items: list[NoteResponse]
    total: int
