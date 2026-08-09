from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
import logging

from app.core.config import settings
from app.database import Base, engine
from app.routers import auth, detection, users, reports, admin

logger = logging.getLogger("verifinews")

# Creates tables if they don't exist yet, and patches columns onto tables
# that already existed before a feature was added (e.g. avatar_url).
#
# Wrapped in try/except: this runs on every cold start, and if the DB is
# briefly unreachable (or DATABASE_URL is misconfigured) it must NOT crash
# the entire serverless function — that turns a transient DB hiccup into a
# hard 500 FUNCTION_INVOCATION_FAILED for every request. Log it instead and
# let route-level DB calls raise their own (recoverable) errors.
try:
    Base.metadata.create_all(bind=engine)
    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT"))
        conn.commit()
except Exception:
    logger.exception("Startup DB init/migration failed — continuing without it")

app = FastAPI(title="VerifiNews API")

app.add_middleware(
    CORSMiddleware,
    # The app authenticates via a Bearer token in the Authorization header,
    # not cookies, so allow_credentials isn't needed here. That means we can
    # safely use a wildcard origin instead of exact-matching FRONTEND_ORIGIN
    # strings (which was fragile — trailing slashes, stale preview URLs after
    # a project got recreated, env var scoped to the wrong environment, etc.
    # all silently broke CORS). If cookie-based auth is added later, this
    # needs to go back to an explicit allow_origins list + allow_credentials.
    allow_origins=["*"],
    allow_credentials=False,
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
