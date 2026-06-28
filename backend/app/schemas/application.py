from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.job_application import ApplicationStatus, JobType


class ApplicationCreate(BaseModel):
    company_name: str = Field(min_length=1, max_length=255)
    position: str = Field(min_length=1, max_length=255)
    job_type: JobType
    source: str = Field(min_length=1, max_length=100)
    jd_url: str | None = None
    location: str | None = Field(default=None, max_length=255)
    salary: str | None = Field(default=None, max_length=100)
    expected_salary: str | None = Field(default=None, max_length=100)
    status: ApplicationStatus = ApplicationStatus.applied
    applied_at: datetime | None = None


class ApplicationUpdate(BaseModel):
    company_name: str | None = Field(default=None, min_length=1, max_length=255)
    position: str | None = Field(default=None, min_length=1, max_length=255)
    job_type: JobType | None = None
    source: str | None = Field(default=None, min_length=1, max_length=100)
    jd_url: str | None = None
    location: str | None = Field(default=None, max_length=255)
    salary: str | None = Field(default=None, max_length=100)
    expected_salary: str | None = Field(default=None, max_length=100)
    status: ApplicationStatus | None = None
    applied_at: datetime | None = None


class ApplicationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    company_name: str
    position: str
    jd_url: str | None
    job_type: JobType
    location: str | None
    salary: str | None
    expected_salary: str | None
    source: str
    status: ApplicationStatus
    applied_at: datetime
    created_at: datetime
    updated_at: datetime


class ApplicationListResponse(BaseModel):
    items: list[ApplicationResponse]
    total: int
