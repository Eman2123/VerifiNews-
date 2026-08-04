from app.main import app

# Vercel's Python runtime looks for a FastAPI/ASGI instance named `app` at
# a supported entrypoint (api/index.py is one of them). This file doesn't
# add any logic — it just re-exports the real app object from app/main.py
# so the existing project structure doesn't need to change.