"""ORM models — import submodules for Alembic autogenerate."""

from app.models.application_note import ApplicationNote  # noqa: F401
from app.models.job_application import JobApplication  # noqa: F401

__all__ = ["ApplicationNote", "JobApplication"]
