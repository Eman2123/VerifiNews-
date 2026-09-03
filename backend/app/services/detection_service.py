import time

import requests

from app.core.config import settings

# facebook/bart-large-mnli is a zero-shot-classification model — it doesn't
# have "fake"/"real" labels built in like the old local model did. Instead we
# hand it candidate labels at request time and it scores how well the text
# fits each one.
CANDIDATE_LABELS = ["fake news", "real news"]

TIMEOUT_SECONDS = 60  # was 6 — bart-large-mnli can take 20-40s to cold-start on the free tier
MAX_RETRIES = 3


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

    last_error: str | None = None

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            response = requests.post(
                settings.HF_MODEL_URL,
                headers=headers,
                json=payload,
                timeout=TIMEOUT_SECONDS,
            )
        except requests.exceptions.Timeout:
            # Slow response, not a hard failure — worth one more try.
            last_error = f"Timed out after {TIMEOUT_SECONDS}s"
            time.sleep(3)
            continue
        except requests.RequestException as e:
            raise DetectionServiceError(f"Failed to reach Hugging Face API: {e}")

        # The router returns 503 while it spins the model up (cold start).
        # It's transient, so wait the time HF tells us and retry instead of
        # failing immediately.
        if response.status_code == 503:
            wait_time = 10
            try:
                wait_time = response.json().get("estimated_time", 10)
            except ValueError:
                pass
            last_error = "Model is warming up on Hugging Face"
            time.sleep(min(wait_time, TIMEOUT_SECONDS))
            continue

        if response.status_code != 200:
            raise DetectionServiceError(
                f"Hugging Face API error ({response.status_code}): {response.text[:300]}"
            )

        return response.json()

    raise DetectionServiceError(
        f"Hugging Face API did not respond after {MAX_RETRIES} attempts ({last_error})"
    )


def _normalize_result(hf_result) -> tuple[str, float]:
    """
    Zero-shot-classification response normally looks like:
    {
        "sequence": "...",
        "labels": ["fake news", "real news"],
        "scores": [0.87, 0.13]
    }
    labels/scores come back sorted highest-score-first, so index 0 is the winner.

    The router sometimes wraps this in a list instead — [{"sequence": ..., ...}] —
    so unwrap that case first before treating it as a dict.
    """
    if isinstance(hf_result, list):
        if not hf_result:
            raise DetectionServiceError(f"Empty model output: {hf_result}")
        hf_result = hf_result[0]

    if not isinstance(hf_result, dict):
        raise DetectionServiceError(f"Unexpected model output shape: {hf_result}")

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
