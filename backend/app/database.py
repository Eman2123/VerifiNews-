from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,   # checks the connection is alive before using it —
                          # avoids "SSL connection has been closed unexpectedly"
                          # when Neon drops an idle connection
    pool_recycle=300,     # proactively recycle connections every 5 min, before
                          # Neon's own idle timeout kills them
    connect_args={
        # Without this, a slow/sleeping/unreachable DB can hang the connection
        # attempt for a long time. On Vercel that happens at import time on
        # every cold start, BEFORE the app object and CORS middleware even
        # exist — so a hung connection times out the whole serverless
        # function and the browser sees a bare infra error with no CORS
        # headers, which looks exactly like a CORS misconfiguration even
        # though the CORS config itself is fine. Failing fast here means the
        # try/except in main.py can actually catch it and move on.
        "connect_timeout": 5,
    },
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
