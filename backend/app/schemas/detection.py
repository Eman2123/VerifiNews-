import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.database import get_db
from app.models.detection import DetectionHistory, InputType, ResultLabel
from app.models.user import User
from app.schemas.detection import DetectRequest, DetectResponse, HistoryItem
from app.services.detection_service import analyze_text, DetectionServiceError
from app.services.scraper_service import extract_text_from_url, ScraperError

router = APIRouter(tags=["detection"])


@router.post("/detect", response_model=DetectResponse)
def detect(
    payload: DetectRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Step 1: get the actual text to analyze
    if payload.type == "url":
        try:
            text_to_analyze = extract_text_from_url(payload.input)
        except ScraperError as e:
            raise HTTPException(status_code=400, detail=str(e))
    else:
        text_to_analyze = payload.input

    # Step 2: run it through the model
    try:
        result = analyze_text(text_to_analyze)
    except DetectionServiceError as e:
        raise HTTPException(status_code=502, detail=str(e))

    # Step 3: save to history
    try:
        record = DetectionHistory(
            user_id=current_user.id,
            input_text=payload.input,
            input_type=InputType(payload.type),
            result_label=ResultLabel(result["result_label"]),
            confidence=result["confidence"],
        )
        db.add(record)
        db.commit()
        db.refresh(record)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Analysis succeeded but saving to history failed: {e}",
        )

    return record


@router.get("/history", response_model=list[HistoryItem])
def get_history(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    records = (
        db.query(DetectionHistory)
        .filter(DetectionHistory.user_id == current_user.id)
        .order_by(DetectionHistory.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return records


@router.delete("/history/{history_id}", status_code=204)
def delete_history_item(
    history_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = (
        db.query(DetectionHistory)
        .filter(
            DetectionHistory.id == history_id,
            DetectionHistory.user_id == current_user.id,
        )
        .first()
    )
    if not record:
        raise HTTPException(status_code=404, detail="History entry not found")

    db.delete(record)
    db.commit()
    return None


@router.delete("/history", status_code=204)
def clear_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db.query(DetectionHistory).filter(DetectionHistory.user_id == current_user.id).delete()
    db.commit()
    return None
