# VerifiNews

VerifiNews is an AI-powered news verification platform that analyzes article text and predicts whether the content is **Real or Fake**, along with a confidence score. It also provides authentication, analysis history, reporting, and an admin dashboard for managing users and detection records.

## Features

- AI-powered fake news detection
- Real/Fake classification with confidence score
- User authentication and profiles
- Detection history
- Report and flagged-content management
- Admin dashboard
- FastAPI backend
- Next.js frontend
- PostgreSQL database with Neon
- Hugging Face inference for the detection model

## Tech Stack

**Frontend:** Next.js, React, TypeScript

**Backend:** Python, FastAPI

**Database:** PostgreSQL, Neon

**AI/ML:** Hugging Face

**Deployment:** Vercel, Railway/Render, Neon

## Project Structure

```text
VerifiNews/
├── backend/       # FastAPI backend
├── frontend/      # Next.js frontend
├── DEPLOY.md      # Deployment guide
└── README.md
```

## Requirements

- Python 3.10+
- Node.js 18+
- npm
- PostgreSQL database (Neon recommended)
- Hugging Face account and API token

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Eman2123/VerifiNews-.git
cd VerifiNews-
```

### 2. Backend

```bash
cd backend
python -m venv venv
```

On Windows:

```bash
venv\Scripts\activate
```

On macOS/Linux:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `.env` from `.env.example` and configure:

```env
DATABASE_URL=your_neon_postgresql_url
SECRET_KEY=your_secret_key
HF_API_TOKEN=your_huggingface_token
HF_MODEL_URL=your_huggingface_model_url
FRONTEND_ORIGIN=http://localhost:3000
```

Start the API:

```bash
uvicorn app.main:app --reload
```

Backend API docs:

```text
http://localhost:8000/docs
```

### 3. Frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Create `.env.local` from `.env.local.example` and make sure the API URL points to the backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## How It Works

1. A user signs in or creates an account.
2. The user submits news/article text for analysis.
3. The backend sends the text to the configured Hugging Face model.
4. VerifiNews returns the predicted classification and confidence score.
5. The result is stored in the user's detection history.
6. Users can review previous checks and submit reports when needed.
7. Admins can manage users, detection logs, and flagged reports.

## Admin Access

Admin accounts are not created through normal sign-up. After creating an account, an administrator can assign the role through the PostgreSQL database:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

After changing the role, log out and sign in again to access the admin dashboard.

## Troubleshooting

| Problem | Possible Fix |
|---|---|
| `pip install` fails | Check that Python 3.10+ is installed |
| CORS error | Verify `FRONTEND_ORIGIN` matches the frontend URL |
| First detection is slow | The Hugging Face model may need to wake from a cold start |
| 401 after login | Check `NEXT_PUBLIC_API_URL` and restart the frontend |
| Database connection fails | Verify the Neon `DATABASE_URL` and SSL configuration |

## Deployment

For production deployment, see [`DEPLOY.md`](./DEPLOY.md) for the database, backend, and frontend deployment setup.

## License

This project is intended for educational and project demonstration purposes.
