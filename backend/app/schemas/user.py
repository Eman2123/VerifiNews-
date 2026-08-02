from pydantic import BaseModel, EmailStr, field_validator


class UpdateProfileRequest(BaseModel):
    name: str | None = None
    current_password: str | None = None
    new_password: str | None = None

    @field_validator('new_password')
    @classmethod
    def validate_new_password(cls, v):
        if v is not None and len(v) < 8:
            raise ValueError('New password must be at least 8 characters')
        return v


class AvatarResponse(BaseModel):
    avatar_url: str | None = None