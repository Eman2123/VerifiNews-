import requests

from app.core.config import settings

# facebook/bart-large-mnli is a zero-shot-classification model — it doesn't
# have "fake"/"real" labels built in like the old local model did. Instead we
# hand it candidate labels at request time and it scores how well the text
# fits each one.
CANDIDATE_LABELS = ["fake news", "real news"]

TIMEOUT_SECONDS = 45


class DetectionServiceError(Exception):
    pass


def _call_hf_api(text: str) -> dict:
    if not settings.HF_API_TOKEN or not settings.HF_MODEL_URL:
        raise DetectionServiceError(
            "HF_API_TOKEN / HF_MODEL_URL are not configured (check your .env)"
        )

    headers = {
        "Authorization": f"Bearer {settings.HF_API_TOKEN}",
        "Content-Type": "application/json",
    }
    payload = {
        "inputs": text,
        "parameters": {"candidate_labels": CANDIDATE_LABELS},
    }

    try:
        response = requests.post(
            settings.HF_MODEL_URL,
            headers=headers,
            json=payload,
            timeout=TIMEOUT_SECONDS,
        )
    except requests.RequestException as e:
        raise DetectionServiceError(f"Failed to reach Hugging Face API: {e}")

    # The router can return 503 for a bit while it spins up the model — worth
    # surfacing that distinctly since it's usually transient.
    if response.status_code == 503:
        raise DetectionServiceError(
            "Model is warming up on Hugging Face, please try again in a few seconds"
        )
    if response.status_code != 200:
        raise DetectionServiceError(
            f"Hugging Face API error ({response.status_code}): {response.text[:300]}"
        )

    return response.json()


def _normalize_result(hf_result: dict) -> tuple[str, float]:
    """
    Zero-shot-classification response looks like:
    {
        "sequence": "...",
        "labels": ["fake news", "real news"],
        "scores": [0.87, 0.13]
    }
    labels/scores come back sorted highest-score-first, so index 0 is the winner.
    """
    labels = hf_result.get("labels")
    scores = hf_result.get("scores")

    if not labels or not scores:
        raise DetectionServiceError(f"Unexpected model output shape: {hf_result}")

    top_label = labels[0]
    top_score = scores[0]

    label = "fake" if top_label == "fake news" else "real"
    confidence = round(top_score * 100, 2)

    return label, confidence


def analyze_text(text: str) -> dict:
    # Keep payload size reasonable, same as before.
    hf_result = _call_hf_api(text[:2000])
    label, confidence = _normalize_result(hf_result)
    return {"result_label": label, "confidence": confidence}
