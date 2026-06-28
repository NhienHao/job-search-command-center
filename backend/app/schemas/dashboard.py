from pydantic import BaseModel


class DashboardByStatus(BaseModel):
    applied: int
    screening: int
    interview: int
    offer: int
    rejected: int
    on_hold: int


class DashboardSummary(BaseModel):
    total_applications: int
    by_status: DashboardByStatus
    interviews_conducted: int
