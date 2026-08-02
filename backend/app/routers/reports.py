from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.database import get_db
from app.models.detection import DetectionHistory
from app.models.report import Report
from app.models.user import User
from app.schemas.report import ReportRequest, ReportOut

router = APIRouter(tags=["reports"])


@router.post("/report", response_model=ReportOut, status_code=201)
def create_report(
    payload: ReportRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    detection = (
        db.query(DetectionHistory)
        .filter(
            DetectionHistory.id == payload.detection_id,
            DetectionHistory.user_id == current_user.id,
        )
        .first()
    )
    if not detection:
        raise HTTPException(status_code=404, detail="Detection not found")

    existing = (
        db.query(Report)
        .filter(
            Report.detection_id == payload.detection_id,
            Report.user_id == current_user.id,
        )
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="You already reported this result")

    report = Report(
        detection_id=payload.detection_id,
        user_id=current_user.id,
        reason=payload.reason,
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report
