import uuid
from datetime import datetime

from pydantic import BaseModel

from app.models.detection import InputType, ResultLabel


class DetectRequest(BaseModel):
    input: str
    type: InputType


class DetectResponse(BaseModel):
    id: uuid.UUID
    input_text: str
    input_type: InputType
    result_label: ResultLabel
    confidence: float
    created_at: datetime

    class Config:
        from_attributes = True


class HistoryItem(BaseModel):
    id: uuid.UUID
    input_text: str
    input_type: InputType
    result_label: ResultLabel
    confidence: float
    created_at: datetime

    class Config:
        from_attributes = True
