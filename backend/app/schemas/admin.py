import uuid
from datetime import datetime

from pydantic import BaseModel


class AdminStats(BaseModel):
    total_users: int
    total_checks: int
    fake_count: int
    real_count: int
    pending_reports: int
    daily_checks: list[dict]  # [{"date": "2026-07-20", "count": 5}, ...]


class AdminUserOut(BaseModel):
    id: uuid.UUID
    name: str
    email: str
    role: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class UpdateUserRequest(BaseModel):
    role: str | None = None
    status: str | None = None


class AdminLogOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    input_text: str
    input_type: str
    result_label: str
    confidence: float
    created_at: datetime

    class Config:
        from_attributes = True


class AdminReportOut(BaseModel):
    id: uuid.UUID
    detection_id: uuid.UUID
    user_id: uuid.UUID
    reason: str | None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class UpdateReportRequest(BaseModel):
    status: str
