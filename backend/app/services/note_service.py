import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.application_note import ApplicationNote, NoteType
from app.models.job_application import JobApplication
from app.schemas.note import NoteCreate, NoteUpdate


class NoteValidationError(ValueError):
    pass


def _resolve_interview_completed(
    note_type: NoteType,
    interview_completed: bool | None,
    *,
    interview_completed_set: bool,
) -> bool | None:
    if note_type != NoteType.interview:
        if interview_completed_set and interview_completed is not None:
            raise NoteValidationError(
                "interview_completed can only be set when note_type is interview"
            )
        return None
    return interview_completed


def list_notes(
    db: Session,
    application_id: uuid.UUID,
) -> tuple[list[ApplicationNote], int] | None:
    application = db.get(JobApplication, application_id)
    if application is None:
        return None

    query = (
        select(ApplicationNote)
        .where(ApplicationNote.application_id == application_id)
        .order_by(ApplicationNote.created_at.desc())
    )
    items = list(db.scalars(query).all())
    return items, len(items)


def get_note(db: Session, note_id: uuid.UUID) -> ApplicationNote | None:
    return db.get(ApplicationNote, note_id)


def create_note(
    db: Session,
    application_id: uuid.UUID,
    payload: NoteCreate,
) -> ApplicationNote | None:
    application = db.get(JobApplication, application_id)
    if application is None:
        return None

    data = payload.model_dump()
    data["interview_completed"] = _resolve_interview_completed(
        data["note_type"],
        data.get("interview_completed"),
        interview_completed_set=data.get("interview_completed") is not None,
    )
    data["application_id"] = application_id

    note = ApplicationNote(**data)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


def update_note(
    db: Session,
    note_id: uuid.UUID,
    payload: NoteUpdate,
) -> ApplicationNote | None:
    note = get_note(db, note_id)
    if note is None:
        return None

    updates = payload.model_dump(exclude_unset=True)
    note_type = updates.get("note_type", note.note_type)
    interview_completed_set = "interview_completed" in updates
    interview_completed = updates.get("interview_completed", note.interview_completed)

    updates["interview_completed"] = _resolve_interview_completed(
        note_type,
        interview_completed,
        interview_completed_set=interview_completed_set,
    )

    for field, value in updates.items():
        setattr(note, field, value)

    db.commit()
    db.refresh(note)
    return note


def delete_note(db: Session, note_id: uuid.UUID) -> bool:
    note = get_note(db, note_id)
    if note is None:
        return False

    db.delete(note)
    db.commit()
    return True
