from datetime import datetime, timezone

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    generate_password_reset_token,
    hash_reset_token,
)
from app.core.config import settings
from app.database import get_db
from app.models.user import User
from app.models.password_reset import PasswordResetToken
from app.schemas.auth import (
    SignupRequest,
    LoginRequest,
    TokenResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest,
)
from app.services.email_service import send_password_reset_email

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        name=payload.name,
        email=payload.email,
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    return TokenResponse(access_token=token, user=user)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    return TokenResponse(access_token=token, user=user)


@router.post("/forgot-password", status_code=status.HTTP_200_OK)
def forgot_password(
    payload: ForgotPasswordRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    # Always return the same generic response whether or not the email is
    # registered — this prevents account enumeration via this endpoint.
    generic_response = {
        "message": "If an account exists for this email, a reset link has been sent."
    }

    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        return generic_response

    raw_token, token_hash, expires_at = generate_password_reset_token()
    reset_token = PasswordResetToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=expires_at,
    )
    db.add(reset_token)
    db.commit()

    reset_link = f"{settings.primary_frontend_origin}/auth/reset-password?token={raw_token}"
    background_tasks.add_task(send_password_reset_email, user.email, reset_link)

    return generic_response


@router.post("/reset-password", status_code=status.HTTP_200_OK)
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    if len(payload.new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters.")

    token_hash = hash_reset_token(payload.token)
    reset_token = (
        db.query(PasswordResetToken).filter(PasswordResetToken.token_hash == token_hash).first()
    )

    now = datetime.now(timezone.utc)
    if (
        not reset_token
        or reset_token.used_at is not None
        or reset_token.expires_at < now
    ):
        raise HTTPException(status_code=400, detail="Invalid or expired reset link.")

    user = db.query(User).filter(User.id == reset_token.user_id).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired reset link.")

    user.password_hash = hash_password(payload.new_password)
    reset_token.used_at = now
    db.commit()

    return {"message": "Password reset successfully. You can now sign in."}