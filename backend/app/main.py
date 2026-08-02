from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.config import settings
from app.database import Base, engine
from app.routers import auth, detection, users, reports, admin

# Creates tables if they don't exist yet (fine for early dev; switch to Alembic migrations later)
Base.metadata.create_all(bind=engine)

# create_all() only creates missing TABLES — it won't add new columns to a
# table that already exists (e.g. an existing Neon database from before the
# avatar feature). Patch that in here so existing deployments don't break.
with engine.connect() as conn:
    conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT"))
    conn.commit()

app = FastAPI(title="VerifiNews API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(detection.router)
app.include_router(users.router)
app.include_router(reports.router)
app.include_router(admin.router)


@app.get("/")
def root():
    return {"status": "VerifiNews API running"}