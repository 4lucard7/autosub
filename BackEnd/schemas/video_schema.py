from pydantic import BaseModel

def video_serializer(video) -> dict:
    return {
        "id": str(video["_id"]),
        "video_id": video.get("video_id", str(video["_id"])),
        "user_id": video.get("user_id"),
        "original_filename": video.get("original_filename"),
        "video_path": video.get("video_path"),
        "audio_path": video.get("audio_path"),
        "size_bytes": video.get("size_bytes"),
        "duration_seconds": video.get("duration_seconds"),
        "created_at": video.get("created_at"),
        "updated_at": video.get("updated_at")
    }

def videos_serializer(videos) -> list:
    return [video_serializer(video) for video in videos]