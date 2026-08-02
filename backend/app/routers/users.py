import base64

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.core.security import hash_password, verify_password
from app.database import get_db
from app.models.user import User
from app.schemas.auth import UserOut
from app.schemas.user import AvatarResponse, UpdateProfileRequest

router = APIRouter(prefix="/users", tags=["users"])

# Profile photos are stored as base64 data URLs directly on the user row —
# there's no object storage (S3/etc.) wired up yet, and this keeps things
# simple for now. Capped well under Postgres's limits.
MAX_AVATAR_BYTES = 3 * 1024 * 1024  # 3MB


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/me", response_model=UserOut)
def update_me(
    payload: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if payload.name:
        current_user.name = payload.name

    if payload.new_password:
        if not payload.current_password:
            raise HTTPException(
                status_code=400, detail="Current password is required to set a new one"
            )
        if not verify_password(payload.current_password, current_user.password_hash):
            raise HTTPException(status_code=400, detail="Current password is incorrect")
        current_user.password_hash = hash_password(payload.new_password)

    db.commit()
    db.refresh(current_user)
    return current_user


@router.post("/me/avatar", response_model=AvatarResponse)
async def upload_avatar(
    avatar: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not avatar.content_type or not avatar.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    contents = await avatar.read()
    if len(contents) > MAX_AVATAR_BYTES:
        raise HTTPException(status_code=400, detail="Image must be under 3MB")

    encoded = base64.b64encode(contents).decode("utf-8")
    current_user.avatar_url = f"data:{avatar.content_type};base64,{encoded}"

    db.commit()
    db.refresh(current_user)
    return {"avatar_url": current_user.avatar_url}


@router.delete("/me/avatar", response_model=AvatarResponse)
def remove_avatar(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    current_user.avatar_url = None
    db.commit()
    return {"avatar_url": None}