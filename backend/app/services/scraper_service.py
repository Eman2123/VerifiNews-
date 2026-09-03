import requests
from bs4 import BeautifulSoup

# A fuller, more "real browser" header set. Sites that 403 on a bare
# User-Agent (common with basic bot-protection) often let a request through
# once Accept / Accept-Language / Referer / sec-fetch-* are also present.
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
    ),
    "Accept": (
        "text/html,application/xhtml+xml,application/xml;q=0.9,"
        "image/avif,image/webp,*/*;q=0.8"
    ),
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://www.google.com/",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "cross-site",
    "Upgrade-Insecure-Requests": "1",
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
        with requests.Session() as session:
            response = session.get(url, headers=HEADERS, timeout=timeout, allow_redirects=True)
            response.raise_for_status()
    except requests.HTTPError as e:
        status = e.response.status_code if e.response is not None else None
        if status == 403:
            raise ScraperError(
                "This site is blocking automated access (403 Forbidden). "
                "Try pasting the article text directly instead of the URL."
            )
        raise ScraperError(f"Could not fetch URL: {e}")
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
