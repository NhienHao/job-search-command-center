import uuid

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.note import NoteCreate, NoteListResponse, NoteResponse, NoteUpdate
from app.services import note_service
from app.services.note_service import NoteValidationError

nested_router = APIRouter(
    prefix="/applications/{application_id}/notes",
    tags=["notes"],
)
flat_router = APIRouter(prefix="/notes", tags=["notes"])


@nested_router.get("", response_model=NoteListResponse)
def list_notes(
    application_id: uuid.UUID,
    db: Session = Depends(get_db),
) -> NoteListResponse:
    result = note_service.list_notes(db, application_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Application not found")

    items, total = result
    return NoteListResponse(
        items=[NoteResponse.model_validate(item) for item in items],
        total=total,
    )


@nested_router.post("", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
def create_note(
    application_id: uuid.UUID,
    payload: NoteCreate,
    db: Session = Depends(get_db),
) -> NoteResponse:
    try:
        note = note_service.create_note(db, application_id, payload)
    except NoteValidationError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    if note is None:
        raise HTTPException(status_code=404, detail="Application not found")

    return NoteResponse.model_validate(note)


@flat_router.patch("/{note_id}", response_model=NoteResponse)
def update_note(
    note_id: uuid.UUID,
    payload: NoteUpdate,
    db: Session = Depends(get_db),
) -> NoteResponse:
    try:
        note = note_service.update_note(db, note_id, payload)
    except NoteValidationError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")

    return NoteResponse.model_validate(note)


@flat_router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(
    note_id: uuid.UUID,
    db: Session = Depends(get_db),
) -> Response:
    deleted = note_service.delete_note(db, note_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Note not found")

    return Response(status_code=status.HTTP_204_NO_CONTENT)
