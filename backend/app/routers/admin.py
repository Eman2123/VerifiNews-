from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.deps import require_admin
from app.database import get_db
from app.models.detection import DetectionHistory, ResultLabel
from app.models.report import Report, ReportStatus
from app.models.user import User, UserRole, UserStatus
from app.schemas.admin import (
    AdminStats,
    AdminUserOut,
    UpdateUserRequest,
    AdminLogOut,
    AdminReportOut,
    UpdateReportRequest,
)

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(require_admin)])


@router.get("/stats", response_model=AdminStats)
def get_stats(db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    total_checks = db.query(DetectionHistory).count()
    fake_count = (
        db.query(DetectionHistory).filter(DetectionHistory.result_label == ResultLabel.fake).count()
    )
    real_count = (
        db.query(DetectionHistory).filter(DetectionHistory.result_label == ResultLabel.real).count()
    )
    pending_reports = db.query(Report).filter(Report.status == ReportStatus.pending).count()

    # Last 7 days of check volume, for a simple trend chart
    since = datetime.now(timezone.utc) - timedelta(days=7)
    rows = (
        db.query(
            func.date(DetectionHistory.created_at).label("date"),
            func.count(DetectionHistory.id).label("count"),
        )
        .filter(DetectionHistory.created_at >= since)
        .group_by(func.date(DetectionHistory.created_at))
        .order_by(func.date(DetectionHistory.created_at))
        .all()
    )
    daily_checks = [{"date": str(r.date), "count": r.count} for r in rows]

    return AdminStats(
        total_users=total_users,
        total_checks=total_checks,
        fake_count=fake_count,
        real_count=real_count,
        pending_reports=pending_reports,
        daily_checks=daily_checks,
    )


@router.get("/users", response_model=list[AdminUserOut])
def list_users(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return (
        db.query(User)
        .order_by(User.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.patch("/users/{user_id}", response_model=AdminUserOut)
def update_user(user_id: str, payload: UpdateUserRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if payload.role:
        if payload.role not in [r.value for r in UserRole]:
            raise HTTPException(status_code=400, detail="Invalid role")
        user.role = UserRole(payload.role)

    if payload.status:
        if payload.status not in [s.value for s in UserStatus]:
            raise HTTPException(status_code=400, detail="Invalid status")
        user.status = UserStatus(payload.status)

    db.commit()
    db.refresh(user)
    return user


@router.get("/logs", response_model=list[AdminLogOut])
def list_logs(
    skip: int = 0,
    limit: int = 50,
    result_label: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(DetectionHistory)
    if result_label:
        query = query.filter(DetectionHistory.result_label == result_label)
    return (
        query.order_by(DetectionHistory.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.get("/reports", response_model=list[AdminReportOut])
def list_reports(
    skip: int = 0,
    limit: int = 50,
    status: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Report)
    if status:
        query = query.filter(Report.status == status)
    return (
        query.order_by(Report.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.patch("/reports/{report_id}", response_model=AdminReportOut)
def update_report(
    report_id: str,
    payload: UpdateReportRequest,
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin),
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    if payload.status not in [s.value for s in ReportStatus]:
        raise HTTPException(status_code=400, detail="Invalid status")

    report.status = ReportStatus(payload.status)
    report.reviewed_by = current_admin.id
    db.commit()
    db.refresh(report)
    return report
