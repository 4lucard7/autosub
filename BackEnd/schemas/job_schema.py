from pydantic import BaseModel

class JobCreate(BaseModel):
    video_path: str
    user_id: str

def job_serializer(job) -> dict:
    return {
        "id": str(job["_id"]),
        "job_id": job.get("job_id"),
        "user_id": job.get("user_id"),
        "video_path": job.get("video_path"),
        "audio_path": job.get("audio_path"),
        "status": job.get("status"),
        "created_at": job.get("created_at"),
        "updated_at": job.get("updated_at")
    }

def jobs_serializer(jobs) -> list:
    return [job_serializer(job) for job in jobs]