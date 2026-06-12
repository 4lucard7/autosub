import os
from pydantic import BaseModel
from typing import Optional

STORAGE_BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "storage"))

class SubtitleStyle(BaseModel):
    font_name: str = "Arial"
    font_size: int = 28
    text_color: str = "#FFFFFF"
    bold: bool = False
    italic: bool = False
    alignment: int = 2  # 2 = Bottom Center, 8 = Top Center, etc.
    margin_v: int = 50
    border_style: int = 1  # 1 = Outline + Shadow, 3 = Background Box
    outline_color: str = "#000000"
    outline_width: float = 2.0
    background_color: str = "#000000"
    background_opacity: float = 0.5
    shadow: float = 1.0
    letter_spacing: float = 0.0
    line_spacing: float = 0.0

class JobCreate(BaseModel):
    video_path: str
    user_id: str
    burn_subtitles: bool = False
    subtitle_style: Optional[SubtitleStyle] = None


def _storage_url(path: str | None) -> str | None:
    if not path:
        return None

    normalized = os.path.normpath(path)
    storage_base = os.path.normpath(STORAGE_BASE)

    if normalized.startswith(storage_base):
        rel_path = os.path.relpath(normalized, storage_base)
        rel_path = rel_path.replace(os.path.sep, "/")
        return f"/storage/{rel_path}"

    return path


def job_serializer(job) -> dict:
    return {
        "id": str(job["_id"]),
        "job_id": job.get("job_id"),
        "user_id": job.get("user_id"),
        "video_path": _storage_url(job.get("video_path")),
        "audio_path": job.get("audio_path"),
        "srt_path": _storage_url(job.get("srt_path")),
        "ass_path": _storage_url(job.get("ass_path")),
        "burned_video_path": _storage_url(job.get("burned_video_path")),
        "error_message": job.get("error_message"),
        "status": job.get("status"),
        "subtitle_style": job.get("subtitle_style"),
        "transcribed_segments": job.get("transcribed_segments"),
        "target_lang": job.get("target_lang"),
        "created_at": job.get("created_at"),
        "updated_at": job.get("updated_at")
    }

def jobs_serializer(jobs) -> list:
    return [job_serializer(job) for job in jobs]