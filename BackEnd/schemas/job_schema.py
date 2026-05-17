from pydantic import BaseModel

class JobCreate(BaseModel):
    video_path: str
    user_id: str

def job_serializer(job) -> dict:
    # Convert absolute paths to public URLs
    def to_url(path):
        if not path: return None
        # Replace backslashes for URL consistency
        rel_path = path.replace("\\", "/").split("/storage/")[-1]
        return f"http://127.0.0.1:8000/storage/{rel_path}"

    return {
        "id": str(job["_id"]),
        "job_id": job.get("job_id"),
        "user_id": job.get("user_id"),
        "video_path": to_url(job.get("video_path")),
        "audio_path": to_url(job.get("audio_path")),
        "srt_path": to_url(job.get("srt_path")),
        "status": job.get("status"),
        "error_message": job.get("error_message"),
        "target_lang": job.get("target_lang"),
        "transcribed_segments": job.get("transcribed_segments", []),
        "created_at": job.get("created_at"),
        "updated_at": job.get("updated_at")
    }

def jobs_serializer(jobs) -> list:
    return [job_serializer(job) for job in jobs]