import enum
import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class ApplicationStatus(str, enum.Enum):
    applied = "applied"
    screening = "screening"
    interview = "interview"
    offer = "offer"
    rejected = "rejected"
    on_hold = "on_hold"


class JobType(str, enum.Enum):
    full_time = "full_time"
    internship = "internship"
    freelance = "freelance"


class JobApplication(Base):
    __tablename__ = "job_applications"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=func.gen_random_uuid(),
    )
    company_name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    position: Mapped[str] = mapped_column(String(255), nullable=False)
    jd_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    job_type: Mapped[JobType] = mapped_column(
        Enum(JobType, name="job_type_enum", native_enum=True),
        nullable=False,
    )
    location: Mapped[str | None] = mapped_column(String(255), nullable=True)
    salary: Mapped[str | None] = mapped_column(String(100), nullable=True)
    expected_salary: Mapped[str | None] = mapped_column(String(100), nullable=True)
    source: Mapped[str] = mapped_column(String(100), nullable=False)
    status: Mapped[ApplicationStatus] = mapped_column(
        Enum(ApplicationStatus, name="application_status_enum", native_enum=True),
        nullable=False,
        server_default=ApplicationStatus.applied.value,
        index=True,
    )
    applied_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        index=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    notes: Mapped[list["ApplicationNote"]] = relationship(
        "ApplicationNote",
        back_populates="application",
        cascade="all, delete-orphan",
    )
