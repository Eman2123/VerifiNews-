import uuid
from datetime import datetime

from pydantic import BaseModel


class ReportRequest(BaseModel):
    detection_id: uuid.UUID
    reason: str | None = None


class ReportOut(BaseModel):
    id: uuid.UUID
    detection_id: uuid.UUID
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
