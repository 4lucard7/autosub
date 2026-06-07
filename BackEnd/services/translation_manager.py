import time
import copy
import json
import logging
import threading
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
        return json.loads(response.read().decode("utf-8"))

# ---------------------------------------------------------------------------
# Logger
# ---------------------------------------------------------------------------
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
MYMEMORY_URL = "https://api.mymemory.translated.net/get"
REQUEST_TIMEOUT = 15          # seconds per HTTP request
MAX_RETRIES = 2               # retry count per chunk
RETRY_DELAY = 0.5             # seconds between retries
CHUNK_MAX_CHARS = 450         # stay safely under MyMemory's 500-char limit
RATE_LIMIT_PER_MINUTE = 30    # max API calls allowed per rolling minute
DEFAULT_SOURCE_LANG = "en"

# ---------------------------------------------------------------------------
# In-memory translation cache
# ---------------------------------------------------------------------------
_cache: dict[tuple[str, str], str] = {}
_cache_lock = threading.Lock()


def get_cached_translation(text: str, target_lang: str) -> str | None:
    """Return cached translation or None if not found."""
    with _cache_lock:
        return _cache.get((text, target_lang))


def set_cached_translation(text: str, target_lang: str, result: str) -> None:
    """Store a translation in the in-memory cache."""
    with _cache_lock:
        _cache[(text, target_lang)] = result


# ---------------------------------------------------------------------------
# Rate limiter (sliding-window counter)
# ---------------------------------------------------------------------------
_request_timestamps: list[float] = []
_rate_lock = threading.Lock()


def _is_rate_limited() -> bool:
    """
    Check whether we have exceeded RATE_LIMIT_PER_MINUTE.
    Cleans up timestamps older than 60 seconds.
    """
    now = time.time()
    window_start = now - 60.0

    with _rate_lock:
        # Purge expired timestamps
        _request_timestamps[:] = [
            ts for ts in _request_timestamps if ts > window_start
        ]
        return len(_request_timestamps) >= RATE_LIMIT_PER_MINUTE


def _record_request() -> None:
    """Record that an API request was made."""
    with _rate_lock:
        _request_timestamps.append(time.time())


# ---------------------------------------------------------------------------
# Text chunking (sentence-aware)
# ---------------------------------------------------------------------------
def split_text(text: str, max_length: int = CHUNK_MAX_CHARS) -> list[str]:
    """
    Split text into chunks that respect sentence boundaries.
    Each chunk will be at most `max_length` characters.
    """
    if not text or len(text) <= max_length:
        return [text] if text else []

    chunks: list[str] = []
    current = ""

    # Split on sentence-ending punctuation followed by a space
    sentences = _split_into_sentences(text)

    for sentence in sentences:
        # If a single sentence exceeds the limit, force-split it
        if len(sentence) > max_length:
            if current.strip():
                chunks.append(current.strip())
                current = ""
            chunks.extend(_force_split(sentence, max_length))
            continue

        if len(current) + len(sentence) <= max_length:
            current += sentence
        else:
            if current.strip():
                chunks.append(current.strip())
            current = sentence

    if current.strip():
        chunks.append(current.strip())

    return chunks


def _split_into_sentences(text: str) -> list[str]:
    """
    Naively split text into sentences by '. ', '! ', '? '.
    Keeps the delimiter attached to the preceding sentence.
    """
    import re
    # Split after sentence-ending punctuation followed by whitespace
    parts = re.split(r'(?<=[.!?])\s+', text)
    return parts


def _force_split(text: str, max_length: int) -> list[str]:
    """
    Force-split a long string by word boundaries when it exceeds max_length.
    Used as a last resort for sentences that are themselves too long.
    """
    words = text.split()
    chunks: list[str] = []
    current = ""

    for word in words:
        if len(current) + len(word) + 1 <= max_length:
            current = f"{current} {word}" if current else word
        else:
            if current:
                chunks.append(current)
            current = word

    if current:
        chunks.append(current)

    return chunks


# ---------------------------------------------------------------------------
# Single-chunk translation (API call)
# ---------------------------------------------------------------------------
def translate_chunk(
    chunk: str,
    target_lang: str,
    source_lang: str = DEFAULT_SOURCE_LANG,
) -> str:
    """
    Translate a single text chunk via MyMemory API.
    Returns the translated text, or the original chunk on failure.
    """
    if not chunk or not chunk.strip():
        return chunk

    params = {
        "q": chunk,
        "langpair": f"{source_lang}|{target_lang}",
    }

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            data = _http_get_json(MYMEMORY_URL, params, REQUEST_TIMEOUT)
            status = data.get("responseStatus")

            if status == 200:
                translated = data["responseData"]["translatedText"]
                _record_request()
                return translated

            # Rate-limited by the API itself (429 or quota exceeded)
            if status in (429, 403):
                logger.warning(
                    "MyMemory rate-limited (status %s), attempt %d/%d",
                    status, attempt, MAX_RETRIES,
                )
            else:
                logger.warning(
                    "MyMemory returned status %s: %s (attempt %d/%d)",
                    status,
                    data.get("responseDetails", "unknown"),
                    attempt,
                    MAX_RETRIES,
                )

        except requests.exceptions.Timeout:
            logger.warning("Request timed out (attempt %d/%d)", attempt, MAX_RETRIES)
        except requests.exceptions.ConnectionError:
            logger.warning("Connection error (attempt %d/%d)", attempt, MAX_RETRIES)
        except requests.exceptions.HTTPError as e:
            logger.error(
                "HTTP error %s (attempt %d/%d)",
                e.response.status_code, attempt, MAX_RETRIES,
            )
        except Exception as e:
            logger.error(
                "Unexpected error: %s (attempt %d/%d)", str(e), attempt, MAX_RETRIES
            )

        if attempt < MAX_RETRIES:
            time.sleep(RETRY_DELAY)

    # All retries exhausted — return original
    logger.error("Translation failed for chunk after %d attempts", MAX_RETRIES)
    return chunk


# ---------------------------------------------------------------------------
# Main translation pipeline
# ---------------------------------------------------------------------------
def translate_text(
    text: str,
    target_lang: str = "fr",
    source_lang: str = DEFAULT_SOURCE_LANG,
) -> str:
    """
    Full translation pipeline:
      1. Check cache
      2. Check rate limit
      3. Split into chunks
      4. Translate each chunk via API
      5. Cache the result
      6. Fallback to original text on any failure

    Args:
        text:        The text to translate.
        target_lang: ISO 639-1 target language code (default: "fr").
        source_lang: ISO 639-1 source language code (default: "en").

    Returns:
        Translated text, or the original text if everything fails.
    """
    if not text or not text.strip():
        return text

    # --- Step 1: Cache lookup ---
    cached = get_cached_translation(text, target_lang)
    if cached is not None:
        logger.info("Cache hit for translation (%s)", target_lang)
        return cached

    # --- Step 2: Rate limit check ---
    if _is_rate_limited():
        logger.warning(
            "Rate limit reached (%d requests/min). Returning original text.",
            RATE_LIMIT_PER_MINUTE,
        )
        return text

    # --- Step 3: Split into chunks ---
    try:
        chunks = split_text(text)
    except Exception as e:
        logger.error("Failed to split text: %s", str(e))
        return text

    # --- Step 4: Translate each chunk ---
    translated_parts: list[str] = []

    for i, chunk in enumerate(chunks):
        # Re-check rate limit before each chunk
        if _is_rate_limited():
            logger.warning(
                "Rate limit hit mid-translation at chunk %d/%d. "
                "Using original text for remaining chunks.",
                i + 1, len(chunks),
            )
            translated_parts.append(chunk)
            continue

        # Check chunk-level cache
        chunk_cached = get_cached_translation(chunk, target_lang)
        if chunk_cached is not None:
            translated_parts.append(chunk_cached)
            continue

        # Call the API
        result = translate_chunk(chunk, target_lang, source_lang)
        translated_parts.append(result)

        # Cache the chunk translation (only if it actually changed)
        if result != chunk:
            set_cached_translation(chunk, target_lang, result)

    # --- Step 5: Rebuild and cache full result ---
    final_text = " ".join(translated_parts)
    set_cached_translation(text, target_lang, final_text)

    return final_text


# ---------------------------------------------------------------------------
# Segment-level translation (for subtitle workflows)
# ---------------------------------------------------------------------------
def translate_segments(segments: list, target_lang: str = "fr") -> list:
    """
    Translate a list of transcription segments while preserving timestamps.

    Each segment is expected to have: start, end, text.
    Returns a NEW list — the original segments are not modified.
    """
    translated_segments = []

    for segment in segments:
        new_segment = copy.deepcopy(segment)

        if isinstance(new_segment, dict):
            original_text = new_segment.get("text", "")
            new_segment["text"] = translate_text(original_text, target_lang)
        else:
            original_text = getattr(new_segment, "text", "")
            new_segment.text = translate_text(original_text, target_lang)

        translated_segments.append(new_segment)

    return translated_segments
