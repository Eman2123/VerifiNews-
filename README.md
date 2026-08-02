# VerifiNews — Installation Guide

This is the complete, ready-to-run project — the Horizon template and all
custom VerifiNews code (backend + frontend) are already merged together.
No copy-pasting files around; just install and run.

```
verifinews/
├── README.md          ← this file
├── DEPLOY.md           ← deployment guide (Neon → Railway/Render → Vercel)
├── backend/            ← FastAPI project
└── frontend/            ← Next.js project (Horizon template + VerifiNews)
```

---

## Requirements

| Tool | Version | Why |
|---|---|---|
| Python | 3.10 or newer | Backend uses modern type-hint syntax |
| Node.js | 18.x or newer | Frontend (Next.js 15) |
| npm | comes with Node | Package manager |
| PostgreSQL account | — | Use [Neon.tech](https://neon.tech) (free tier, no local install needed) |
| HuggingFace account | — | Free account at [huggingface.co](https://huggingface.co) for the detection model |
| Git | any recent version | To push to GitHub for deployment later |

You do **not** need XAMPP, a local Postgres install, or Docker — Neon gives
you a hosted database with zero local setup.

---

## 1. Database (Neon.tech)

1. Create a free account at neon.tech
2. Create a new project
3. From the dashboard, copy the **connection string** (looks like
   `postgresql://user:password@host/dbname?sslmode=require`)
4. Keep this handy for the backend `.env` in the next step

---

## 2. Backend Setup

```bash
cd backend
python -m venv venv

# activate the virtual environment
source venv/bin/activate       # macOS/Linux
venv\Scripts\activate          # Windows

pip install -r requirements.txt
```

Copy the example env file and fill in real values:

```bash
cp .env.example .env
```

Edit `.env`:
- `DATABASE_URL` → your Neon connection string from step 1
- `SECRET_KEY` → generate one: `python -c "import secrets; print(secrets.token_hex(32))"`
- `HF_API_TOKEN` → from huggingface.co → Settings → Access Tokens
- `HF_MODEL_URL` → `https://api-inference.huggingface.co/models/<model-name>`
  (search HuggingFace for a "fake news detection" text-classification model)
- Leave `FRONTEND_ORIGIN` as `http://localhost:3000` for local dev

Run the backend:

```bash
uvicorn app.main:app --reload
```

Confirm it's working at **http://localhost:8000/docs** — you should see the
interactive API docs with `/auth`, `/detect`, `/history`, `/users`,
`/report`, and `/admin` endpoints listed.

---

## 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Copy the example env file:

```bash
cp .env.local.example .env.local
```

It already points to `http://localhost:8000` for local dev — no changes
needed unless your backend runs on a different port.

Run the frontend:

```bash
npm run dev
```

Open **http://localhost:3000** — you should see the VerifiNews landing page
(newspaper theme).

---

## 4. First-time test run

1. Click **Sign Up**, create an account → should land on `/dashboard/default`
2. Paste some article text → **Analyze** → a stamped result card should
   appear (Real/Fake + confidence)
3. Check **History** — your check should be listed there
4. Go to **Profile** — try updating your name

### Making yourself an admin

Sign-up never creates admins directly (by design, for security). After
signing up once, open the **Neon SQL editor** in your browser and run:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

Log out and back in — you should now land on `/admin/default` and see the
full admin panel (Dashboard, Users, Detection Logs, Flagged Reports,
Profile).

---

## Optional: downgrade React from RC to stable

The template ships with React 19 release-candidate. It works fine for
development, but if you want a stable version before deploying:

```bash
cd frontend
npm install react@^18.3.1 react-dom@^18.3.1
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `pip install` fails on some package | Make sure you're using Python 3.10+ (`python --version`) |
| Frontend shows CORS errors in console | Check backend `.env` → `FRONTEND_ORIGIN` matches `http://localhost:3000` exactly |
| `/detect` takes 20-30 seconds the first time | Normal — HuggingFace "wakes up" a cold model on first call |
| Sidebar shows no links on `/dashboard` or `/admin` | Make sure `npm install` completed fully and you restarted `npm run dev` after installing |
| 401 error right after logging in | Check `frontend/.env.local` has the correct `NEXT_PUBLIC_API_URL` and restart `npm run dev` |

---

## Next steps

Once this runs locally end-to-end, see `DEPLOY.md` for taking it live
(Vercel + Railway/Render + Neon).
