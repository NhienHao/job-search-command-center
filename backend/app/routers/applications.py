import uuid

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.job_application import ApplicationStatus
from app.schemas.application import (
    ApplicationCreate,
    ApplicationListResponse,
    ApplicationResponse,
    ApplicationUpdate,
)
from app.services import application_service

router = APIRouter(prefix="/applications", tags=["applications"])


@router.get("", response_model=ApplicationListResponse)
def list_applications(
    status: ApplicationStatus | None = None,
    company: str | None = None,
    position: str | None = None,
    source: str | None = None,
    sort: str = "applied_at",
    order: str = "desc",
    db: Session = Depends(get_db),
) -> ApplicationListResponse:
    items, total = application_service.list_applications(
        db,
        status=status,
        company=company,
        position=position,
        source=source,
        sort=sort,
        order=order,
    )
    return ApplicationListResponse(
        items=[ApplicationResponse.model_validate(item) for item in items],
        total=total,
    )


@router.post("", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def create_application(
    payload: ApplicationCreate,
    db: Session = Depends(get_db),
) -> ApplicationResponse:
    application = application_service.create_application(db, payload)
    return ApplicationResponse.model_validate(application)


@router.get("/{application_id}", response_model=ApplicationResponse)
def get_application(
    application_id: uuid.UUID,
    db: Session = Depends(get_db),
) -> ApplicationResponse:
    application = application_service.get_application(db, application_id)
    if application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return ApplicationResponse.model_validate(application)


@router.patch("/{application_id}", response_model=ApplicationResponse)
def update_application(
    application_id: uuid.UUID,
    payload: ApplicationUpdate,
    db: Session = Depends(get_db),
) -> ApplicationResponse:
    application = application_service.update_application(db, application_id, payload)
    if application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return ApplicationResponse.model_validate(application)


@router.delete("/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(
    application_id: uuid.UUID,
    db: Session = Depends(get_db),
) -> Response:
    deleted = application_service.delete_application(db, application_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Application not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
