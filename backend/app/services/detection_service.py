from transformers import pipeline

MODEL_NAME = "jy46604790/Fake-News-Bert-Detect"

# Loaded lazily, once, on first request — not at import time. This keeps
# `uvicorn --reload` fast on every code change (the model won't re-download
# or re-load into memory on every reload, only on first /detect call after
# a fresh process start).
_classifier = None


class DetectionServiceError(Exception):
    pass


def _get_classifier():
    global _classifier
    if _classifier is None:
        try:
            _classifier = pipeline(
                "text-classification",
                model=MODEL_NAME,
                tokenizer=MODEL_NAME,
            )
        except Exception as e:
            raise DetectionServiceError(f"Failed to load local model: {e}")
    return _classifier


def _normalize_result(hf_result: dict) -> tuple[str, float]:
    """
    jy46604790/Fake-News-Bert-Detect output looks like:
    {"label": "LABEL_0", "score": 0.87}   # LABEL_0 = fake, LABEL_1 = real
    """
    raw_label = hf_result.get("label")
    score = hf_result.get("score")

    if raw_label is None or score is None:
        raise DetectionServiceError(f"Unexpected model output shape: {hf_result}")

    label = "fake" if raw_label == "LABEL_0" else "real"
    confidence = round(score * 100, 2)

    return label, confidence


def analyze_text(text: str) -> dict:
    classifier = _get_classifier()
    # This model truncates at 512 tokens anyway; trimming here just keeps
    # the payload small before it hits the tokenizer.
    result = classifier(text[:2000], truncation=True)[0]
    label, confidence = _normalize_result(result)
    return {"result_label": label, "confidence": confidence}
