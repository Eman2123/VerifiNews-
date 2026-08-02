from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    HF_API_TOKEN: str = ""
    HF_MODEL_URL: str = ""

    FRONTEND_ORIGIN: str = "http://localhost:3000"

    RESEND_API_KEY: str = ""
    RESEND_FROM_EMAIL: str = "VerifiNews <onboarding@resend.dev>"
    PASSWORD_RESET_EXPIRE_MINUTES: int = 30

    @property
    def frontend_origins(self) -> list[str]:
        return [origin.strip() for origin in self.FRONTEND_ORIGIN.split(",") if origin.strip()]

    @property
    def primary_frontend_origin(self) -> str:
        origins = self.frontend_origins
        return origins[0] if origins else "http://localhost:3000"

    class Config:
        env_file = ".env"


settings = Settings()  # type: ignore[call-arg]  # values are loaded from .env / env vars