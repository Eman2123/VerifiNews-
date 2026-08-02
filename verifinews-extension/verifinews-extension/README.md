# VerifiNews Browser Extension (MVP)

Real Manifest V3 Chrome extension that talks to your actual FastAPI backend —
no mock data. Matches the landing-page promise: one-click check on any
article, works on any site, no copy-pasting.

## What it does
- **Popup**: sign in with your existing VerifiNews account (JWT stored in
  `chrome.storage.local`), then click **"Check This Page"** to analyze the
  article you're currently reading. You can also paste text manually.
- **Right-click menu**: select any text on any page → right-click →
  **"Check with VerifiNews"** → a floating verdict card appears on the page
  itself (no popup needed).

## 1. Install it (unpacked, for development)
1. Open `chrome://extensions`
2. Turn on **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select this `verifinews-extension` folder
5. Copy the **Extension ID** shown under the VerifiNews card (a long string
   like `abcdefghijklmnopabcdefghijklmnop`) — you need it in step 2.

## 2. Allow the extension in your backend's CORS config
Your FastAPI backend currently only allows `http://localhost:3000`
(`FRONTEND_ORIGIN`, per your `.env`). Browser extensions call your API from
an origin like `chrome-extension://<extension-id>`, so you must add that to
`allow_origins` in your CORS middleware, e.g.:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "chrome-extension://<paste-your-extension-id-here>",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Restart the backend after this change (CORS changes need a restart, same as
noted in your DEPLOY.md).

## 3. Test it
1. Make sure your backend is running on `http://localhost:8000`
2. Click the VerifiNews icon in your Chrome toolbar
3. Sign in with an existing account (same login as the web app)
4. Open any news article, click the icon again → **Check This Page**
5. Or: select a paragraph on any page → right-click → **Check with VerifiNews**

## Notes / current limitations
- `config.js` hardcodes `API_BASE = 'http://localhost:8000'`. When you deploy
  the backend (per your Neon → Railway/Render plan), update this to your
  production URL and reload the extension.
- Article text extraction is a simple heuristic (`<article>` tag, else all
  `<p>` tags) — works well on most news sites but isn't perfect on every
  layout. Same 5000-character limit as the web app's `DetectForm`.
- Not yet published to the Chrome Web Store — this is a "Load unpacked" dev
  build. Publishing later needs a developer account ($5 one-time) and a
  store listing; out of scope for this pass.
- "Highlights suspicious claims right on the page" (from the landing copy)
  is not implemented — only a verdict + confidence score, matching what
  `/detect` actually returns today.
