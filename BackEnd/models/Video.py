from pydantic import BaseModel, Field
from datetime import datetime, timezone
from typing import Optional
from bson import ObjectId

class Video(BaseModel):
    video_id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    user_id: str
    original_filename: str = Field(description="The original name of the uploaded file")
    video_path: str
    audio_path: Optional[str] = None
    size_bytes: Optional[int] = Field(default=None, description="Size of the video file in bytes")
    duration_seconds: Optional[float] = Field(default=None, description="Length of the video in seconds")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
