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
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 