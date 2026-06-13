import os
from pydantic import BaseModel
from typing import Optional
from schemas.subtitle_style_schema import SubtitleStyle as SubtitleStyleModel

STORAGE_BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "storage"))

class JobCreate(BaseModel):
    video_path: str
    user_id: str
    burn_subtitles: bool = False
    subtitle_style: Optional[SubtitleStyleModel] = None
    source_lang: Optional[str] = "auto"
    target_lang: Optional[str] = "fr"


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
        "source_lang": job.get("source_lang"),
        "target_lang": job.get("target_lang"),
        "transcribed_segments": job.get("transcribed_segments"),
        "translated_segments": job.get("translated_segments"),
        "created_at": job.get("created_at"),
        "updated_at": job.get("updated_at")
    }

def jobs_serializer(jobs) -> list:
    return [job_serializer(job) for job in jobs]
