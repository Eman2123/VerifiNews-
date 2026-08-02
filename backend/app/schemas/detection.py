import uuid
from datetime import datetime

from pydantic import BaseModel, field_validator


class DetectRequest(BaseModel):
    input: str
    type: str  # "text" or "url"

    @field_validator("type")
    @classmethod
    def validate_type(cls, v):
        if v not in ("text", "url"):
            raise ValueError('type must be "text" or "url"')
        return v

    @field_validator("input")
    @classmethod
    def validate_input(cls, v):
        if not v or not v.strip():
            raise ValueError("input cannot be empty")
        if len(v) > 20000:
            raise ValueError("input is too long (max 20,000 characters)")
        return v.strip()


class DetectResponse(BaseModel):
    id: uuid.UUID
    result_label: str
    confidence: float
    created_at: datetime

    class Config:
        from_attributes = True


class HistoryItem(BaseModel):
    id: uuid.UUID
    input_text: str
    input_type: str
    result_label: str
    confidence: float
    created_at: datetime

    class Config:
        from_attributes = True
