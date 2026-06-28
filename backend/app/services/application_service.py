import uuid
from datetime import datetime, timezone

from sqlalchemy import Select, func, select
from sqlalchemy.orm import Session

from app.models.job_application import ApplicationStatus, JobApplication
from app.schemas.application import ApplicationCreate, ApplicationUpdate

ALLOWED_SORT_FIELDS = frozenset(
    {"applied_at", "company_name", "position", "status", "created_at"}
)


def _apply_filters(
    query: Select[tuple[JobApplication]],
    *,
    status: ApplicationStatus | None,
    company: str | None,
    position: str | None,
    source: str | None,
) -> Select[tuple[JobApplication]]:
    if status is not None:
        query = query.where(JobApplication.status == status)
    if company:
        query = query.where(JobApplication.company_name.ilike(f"%{company}%"))
    if position:
        query = query.where(JobApplication.position.ilike(f"%{position}%"))
    if source:
        query = query.where(JobApplication.source.ilike(f"%{source}%"))
    return query


def list_applications(
    db: Session,
    *,
    status: ApplicationStatus | None = None,
    company: str | None = None,
    position: str | None = None,
    source: str | None = None,
    sort: str = "applied_at",
    order: str = "desc",
) -> tuple[list[JobApplication], int]:
    sort_field = sort if sort in ALLOWED_SORT_FIELDS else "applied_at"
    sort_column = getattr(JobApplication, sort_field)

    query = select(JobApplication)
    query = _apply_filters(
        query,
        status=status,
        company=company,
        position=position,
        source=source,
    )

    count_query = select(func.count()).select_from(query.subquery())
    total = db.scalar(count_query) or 0

    if order == "asc":
        query = query.order_by(sort_column.asc())
    else:
        query = query.order_by(sort_column.desc())

    items = list(db.scalars(query).all())
    return items, total


def get_application(db: Session, application_id: uuid.UUID) -> JobApplication | None:
    return db.get(JobApplication, application_id)


def create_application(db: Session, payload: ApplicationCreate) -> JobApplication:
    data = payload.model_dump()
    if data.get("applied_at") is None:
        data["applied_at"] = datetime.now(timezone.utc)

    application = JobApplication(**data)
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


def update_application(
    db: Session,
    application_id: uuid.UUID,
    payload: ApplicationUpdate,
) -> JobApplication | None:
    application = get_application(db, application_id)
    if application is None:
        return None

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(application, field, value)

    db.commit()
    db.refresh(application)
    return application


def delete_application(db: Session, application_id: uuid.UUID) -> bool:
    application = get_application(db, application_id)
    if application is None:
        return False

    db.delete(application)
    db.commit()
    return True
