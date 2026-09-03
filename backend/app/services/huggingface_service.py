import requests
import time

HF_API_TOKEN = "your_token_here"  # from env var
HF_MODEL_URL = "https://router.huggingface.co/hf-inference/models/your-model-id"

headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}

def query_huggingface(payload, retries=3):
    for attempt in range(retries):
        try:
            response = requests.post(
                HF_MODEL_URL,
                headers=headers,
                json=payload,
                timeout=60  # 6 se badha kar 60 kar diya
            )

            # Model abhi load ho raha hai (cold start)
            if response.status_code == 503:
                wait_time = response.json().get("estimated_time", 10)
                print(f"Model loading, waiting {wait_time}s...")
                time.sleep(wait_time)
                continue

            response.raise_for_status()
            return response.json()

        except requests.exceptions.Timeout:
            print(f"Attempt {attempt + 1} timed out, retrying...")
            time.sleep(5)

    raise Exception("Hugging Face API failed after retries")
