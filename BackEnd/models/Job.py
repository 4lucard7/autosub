from pydantic import BaseModel, Field
from datetime import datetime, timezone
from typing import Optional, List
from enum import Enum

class JobStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class Job(BaseModel):
    job_id: str
    user_id: str
    video_path: str
    audio_path: Optional[str] = None
    srt_path: Optional[str] = None
    txt_path: Optional[str] = None
    ass_path: Optional[str] = None
    burned_video_path: Optional[str] = None
    burn_subtitles: bool = False
    subtitle_style: Optional[dict] = None
    source_lang: Optional[str] = "auto"
    target_lang: Optional[str] = None
    transcribed_segments: List[dict] = Field(default_factory=list)
    error_message: Optional[str] = None
    status: JobStatus = JobStatus.PENDING
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))