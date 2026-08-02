import enum
import uuid

from sqlalchemy import Column, String, DateTime, Enum, Float, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.database import Base


class InputType(str, enum.Enum):
    text = "text"
    url = "url"


class ResultLabel(str, enum.Enum):
    real = "real"
    fake = "fake"


class DetectionHistory(Base):
    __tablename__ = "detection_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    input_text = Column(Text, nullable=False)
    input_type = Column(Enum(InputType), nullable=False)
    result_label = Column(Enum(ResultLabel), nullable=False)
    confidence = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
