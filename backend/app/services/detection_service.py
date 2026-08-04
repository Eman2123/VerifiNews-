import requests

from app.core.config import settings

# Zero-shot classification via HuggingFace's hosted Inference API — no local
# model, no torch/transformers, so this stays well under Vercel's serverless
# function size limit.
CANDIDATE_LABELS = ["real news", "fake news"]


class DetectionServiceError(Exception):
    pass


def analyze_text(text: str) -> dict:
    if not settings.HF_API_TOKEN or not settings.HF_MODEL_URL:
        raise DetectionServiceError("HF_API_TOKEN / HF_MODEL_URL not configured")

    try:
        response = requests.post(
            settings.HF_MODEL_URL,
            headers={"Authorization": f"Bearer {settings.HF_API_TOKEN}"},
            json={
                "inputs": text[:2000],
                "parameters": {"candidate_labels": CANDIDATE_LABELS},
            },
            timeout=30,
        )
        response.raise_for_status()
    except requests.RequestException as e:
        raise DetectionServiceError(f"HF Inference API request failed: {e}")

    data = response.json()
    labels = data.get("labels")
    scores = data.get("scores")

    if not labels or not scores:
        raise DetectionServiceError(f"Unexpected model output shape: {data}")

    top_label = labels[0]
    confidence = round(scores[0] * 100, 2)
    label = "fake" if top_label == "fake news" else "real"

    return {"result_label": label, "confidence": confidence}
