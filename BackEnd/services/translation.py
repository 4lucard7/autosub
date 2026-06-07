import os
import copy
import json
import logging
from time import sleep
import urllib.parse
import urllib.request

try:
    import requests
except ImportError:
    requests = None

try:
    import httpx
except ImportError:
    httpx = None

# Logger setup
logger = logging.getLogger(__name__)

# MyMemory Translation API (free, no API key required)
API_URL = os.getenv("TRANSLATION_API_URL")


def _http_get_json(url: str, params: dict, timeout: int) -> dict:
    if requests is not None:
        response = requests.get(url, params=params, timeout=timeout)
        response.raise_for_status()
        return response.json()

    if httpx is not None:
        response = httpx.get(url, params=params, timeout=timeout)
        response.raise_for_status()
        return response.json()

    query = urllib.parse.urlencode(params)
    full_url = f"{url}?{query}"
    with urllib.request.urlopen(full_url, timeout=timeout) as response:
        text = response.read().decode("utf-8")
        return json.loads(text)

# Request configuration
REQUEST_TIMEOUT = 15  # seconds
MAX_RETRIES = 3
RETRY_DELAY = 1  # seconds between retries
# MyMemory has a 500 char limit per request, so we split long texts
CHUNK_SIZE = 450


def _send_translation_request(text: str, source_lang: str, target_lang: str) -> str | None:
    """
    Sends a GET request to the MyMemory Translation API.
    Includes a simple retry mechanism on failure.

    Returns the translated text string, or None if all attempts fail.
    """
    params = {
        "q": text,
        "langpair": f"{source_lang}|{target_lang}",
    }

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            data = _http_get_json(API_URL, params, REQUEST_TIMEOUT)
            if data.get("responseStatus") == 200:
                return data["responseData"]["translatedText"]
            else:
                logger.warning(
                    "API returned status %s: %s (attempt %d/%d)",
                    data.get("responseStatus"),
                    data.get("responseDetails"),
                    attempt,
                    MAX_RETRIES,
                )

        except requests.exceptions.Timeout:
            logger.warning("Request timed out (attempt %d/%d)", attempt, MAX_RETRIES)
        except requests.exceptions.ConnectionError:
            logger.warning("Connection error (attempt %d/%d)", attempt, MAX_RETRIES)
        except requests.exceptions.HTTPError as e:
            logger.error("HTTP error %s (attempt %d/%d)", e.response.status_code, attempt, MAX_RETRIES)
        except requests.exceptions.RequestException as e:
            logger.error("Unexpected request error: %s (attempt %d/%d)", str(e), attempt, MAX_RETRIES)

        # Wait before retrying (skip delay on last attempt)
        if attempt < MAX_RETRIES:
            sleep(RETRY_DELAY)

    return None


def _split_text(text: str, max_length: int = CHUNK_SIZE) -> list[str]:
    """
    Splits text into chunks that respect sentence boundaries.
    MyMemory has a ~500 character limit per request.
    """
    if len(text) <= max_length:
        return [text]

    chunks = []
    current = ""

    # Split by sentences (period followed by space)
    sentences = text.replace(". ", ".|").split("|")

    for sentence in sentences:
        if len(current) + len(sentence) <= max_length:
            current += sentence
        else:
            if current:
                chunks.append(current.strip())
            current = sentence

    if current.strip():
        chunks.append(current.strip())

    return chunks


def translate_text(text: str, target_lang: str = "fr", source_lang: str = "en") -> str:
    """
    Translates a single string using the MyMemory Translation API.
    Automatically splits long text into chunks to respect API limits.

    Args:
        text:        The text to translate.
        target_lang: Target language code (default: "fr").
        source_lang: Source language code (default: "en").

    Returns:
        The translated text, or the original text if translation fails.
    """
    if not text or not text.strip():
        return text

    try:
        chunks = _split_text(text)
        translated_parts = []

        for chunk in chunks:
            result = _send_translation_request(chunk, source_lang, target_lang)

            if result:
                translated_parts.append(result)
            else:
                logger.error("Translation failed for chunk, using original")
                translated_parts.append(chunk)

        return " ".join(translated_parts)

    except Exception as e:
        logger.error("Translation failed: %s", str(e))
        return text


def translate_segments(segments: list, target_lang: str = "fr") -> list:
    """
    Translates a list of transcription segments while preserving timestamps.

    Each segment is expected to have: start, end, text.
    Returns a NEW list — the original segments are not modified.

    Args:
        segments:    List of segment objects/dicts with start, end, text.
        target_lang: Target language code (default: "fr").

    Returns:
        A new list of segments with translated text.
    """
    translated_segments = []

    for segment in segments:
        # Deep copy to avoid mutating the original
        new_segment = copy.deepcopy(segment)

        # Handle both dict-like and object-like segments
        if isinstance(new_segment, dict):
            original_text = new_segment.get("text", "")
            new_segment["text"] = translate_text(original_text, target_lang)
        else:
            original_text = getattr(new_segment, "text", "")
            new_segment.text = translate_text(original_text, target_lang)

        translated_segments.append(new_segment)

    return translated_segments
