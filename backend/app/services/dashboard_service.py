from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.application_note import ApplicationNote, NoteType
from app.models.job_application import ApplicationStatus, JobApplication
from app.schemas.dashboard import DashboardByStatus, DashboardSummary


def get_dashboard_summary(db: Session) -> DashboardSummary:
    total_applications = db.scalar(select(func.count()).select_from(JobApplication)) or 0

    status_counts = {status.value: 0 for status in ApplicationStatus}
    rows = db.execute(
        select(JobApplication.status, func.count())
        .group_by(JobApplication.status)
    ).all()

    for status, count in rows:
        key = status.value if isinstance(status, ApplicationStatus) else str(status)
        status_counts[key] = count

    interviews_conducted = (
        db.scalar(
            select(func.count())
            .select_from(ApplicationNote)
            .where(
                ApplicationNote.note_type == NoteType.interview,
                ApplicationNote.interview_completed.is_(True),
            )
        )
        or 0
    )

    return DashboardSummary(
        total_applications=total_applications,
        by_status=DashboardByStatus(**status_counts),
        interviews_conducted=interviews_conducted,
    )
