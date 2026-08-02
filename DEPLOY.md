# VerifiNews — Deployment Guide (Phase 8)

## 1. Database — Neon.tech

Already set up if you followed earlier phases. Just confirm:
- Your Neon project's connection string is ready (Dashboard → Connection Details)
- It includes `?sslmode=require` at the end

## 2. Backend — Railway or Render

Both work the same way; steps below apply to either.

1. Push the `backend/` folder to its own GitHub repo (or a subfolder if your
   platform supports monorepo root paths)
2. Create a new Web Service, connect the repo
3. Set the **root directory** to `backend` if deploying from a monorepo
4. Build command: `pip install -r requirements.txt`
5. Start command: leave default (`Procfile` already has it) or set manually:
   ```
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
6. Add environment variables (same as your local `.env`):
   - `DATABASE_URL` — your Neon connection string
   - `SECRET_KEY` — a long random string (generate a new one for production,
     don't reuse your local dev one)
   - `ALGORITHM` — `HS256`
   - `ACCESS_TOKEN_EXPIRE_MINUTES` — `1440`
   - `HF_API_TOKEN`, `HF_MODEL_URL` — same as local
   - `FRONTEND_ORIGIN` — you'll update this in step 4 once you have your
     Vercel URL (comma-separate if you want both local + prod to work:
     `http://localhost:3000,https://your-app.vercel.app`)
7. Deploy, then visit `https://your-backend-url/docs` to confirm it's live

## 3. Frontend — Vercel

1. Push your full Next.js project (with all the Phase 3-7 files already
   copied in) to GitHub
2. Import the repo in Vercel
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL` — your deployed backend URL from step 2
4. Deploy
5. Go back to your backend's env vars and update `FRONTEND_ORIGIN` to include
   this new Vercel URL, then redeploy the backend so CORS allows it

## 4. Final checks before calling it done

- [ ] Sign up on the live site, confirm redirect to `/dashboard/default`
- [ ] Run a detect check (text and URL both), confirm the stamped result
      card appears
- [ ] Check History shows the entry
- [ ] Report a result, confirm it appears in admin's Flagged Reports
- [ ] Promote your account to admin via Neon SQL editor, log back in, confirm
      `/admin/default` loads with real numbers
- [ ] Try visiting `/admin/*` while logged in as a non-admin user — should
      redirect to `/dashboard/default` (middleware) and the backend should
      also reject with 403 if you hit the API directly (test in `/docs` with
      a non-admin token)
- [ ] Confirm `.env` / `.env.local` are in `.gitignore` and were never
      committed — if they were pushed at any point, rotate `SECRET_KEY` and
      your HF token
- [ ] Test what happens with an empty input, a broken URL, and a very long
      article — all should show a clean error message, not a crash

## Common issues

- **CORS errors in browser console** — `FRONTEND_ORIGIN` on the backend
  doesn't match your actual frontend URL exactly (check for trailing
  slashes, http vs https)
- **401 immediately after login** — check `NEXT_PUBLIC_API_URL` on Vercel is
  set and points to the right backend URL, and that you redeployed after
  adding it (env var changes need a redeploy on Vercel)
- **First detect request takes 20-30s** — normal HuggingFace cold start,
  covered in the backend README
