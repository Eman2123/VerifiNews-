import requests
from bs4 import BeautifulSoup

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
    )
}


class ScraperError(Exception):
    pass


def extract_text_from_url(url: str, timeout: int = 10) -> str:
    """
    Fetches a URL and pulls out the main readable text (paragraph tags).
    This is a simple heuristic extractor — good enough for most news sites,
    not as robust as a dedicated library like newspaper3k, but has far fewer
    dependency headaches. Can be swapped out later if extraction quality
    becomes an issue on specific sites.
    """
    try:
        response = requests.get(url, headers=HEADERS, timeout=timeout)
        response.raise_for_status()
    except requests.RequestException as e:
        raise ScraperError(f"Could not fetch URL: {e}")

    soup = BeautifulSoup(response.text, "html.parser")

    # Remove elements that are never article body content
    for tag in soup(["script", "style", "nav", "header", "footer", "aside", "form"]):
        tag.decompose()

    paragraphs = soup.find_all("p")
    text = " ".join(p.get_text(strip=True) for p in paragraphs)

    if len(text.strip()) < 50:
        raise ScraperError("Could not extract enough readable text from this URL")

    return text.strip()
