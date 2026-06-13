import os
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, BackgroundTasks, Query
from fastapi.responses import FileResponse
from models.Job import Job, JobStatus
from schemas.job_schema import JobCreate, job_serializer, jobs_serializer
from workers.DB import db

router = APIRouter()

DOWNLOAD_FIELDS = {
    "auto": ("burned_video_path", "ass_path", "srt_path"),
    "video": ("burned_video_path",),
    "ass": ("ass_path",),
    "srt": ("srt_path",),
}


def _style_payload(style):
    return style.model_dump(mode="json") if style else None


def _format_vtt_timestamp(seconds: float) -> str:
    total = float(seconds or 0)
    hours = int(total // 3600)
    minutes = int((total % 3600) // 60)
    secs = int(total % 60)
    millis = int((total % 1) * 1000)
    return f"{hours:02}:{minutes:02}:{secs:02}.{millis:03}"


def _build_text_export(job: dict, job_id: str, export_format: str) -> str:
    segments = job.get("translated_segments") or job.get("transcribed_segments") or []
    output_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "storage", "outputs"))
    os.makedirs(output_folder, exist_ok=True)
    output_path = os.path.join(output_folder, f"{job_id}.{export_format}")

    if export_format == "txt":
        content = "\n".join(
            str(segment.get("text", "")).strip()
            for segment in segments
            if str(segment.get("text", "")).strip()
        )
    else:
        lines = ["WEBVTT", ""]
        for segment in segments:
            text = str(segment.get("text", "")).strip()
            if not text:
                continue
            start = _format_vtt_timestamp(segment.get("start", 0))
            end = _format_vtt_timestamp(segment.get("end", 0))
            lines.extend([f"{start} --> {end}", text, ""])
        content = "\n".join(lines)

    with open(output_path, "w", encoding="utf-8") as file:
        file.write(content)
    return output_path

@router.post("/jobs/", response_model=dict)
async def create_job(job_data: JobCreate, background_tasks: BackgroundTasks):
    """
    Creates a new video processing job and returns the job_id.
    """
    job_id = str(uuid.uuid4())
    
    new_job = Job(
        job_id=job_id,
        user_id=job_data.user_id,
        video_path=job_data.video_path,
        burn_subtitles=job_data.burn_subtitles,
        subtitle_style=_style_payload(job_data.subtitle_style),
        source_lang=job_data.source_lang,
        target_lang=job_data.target_lang,
        status=JobStatus.PENDING,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    
    # Save job to database. Convert to dict for MongoDB.
    await db.jobs.insert_one(new_job.model_dump(by_alias=True, mode="json"))
    
    # Trigger the background processing
    from workers.process_video import process_video_task
    background_tasks.add_task(
        process_video_task,
        job_id=job_id,
        video_path=job_data.video_path,
        burn_subtitles=job_data.burn_subtitles,
        source_lang=job_data.source_lang,
        target_lang=job_data.target_lang,
        subtitle_style=_style_payload(job_data.subtitle_style)
    )
    
    return {
        "message": "Job created successfully",
        "job_id": job_id
    }

@router.get("/jobs/{job_id}", response_model=dict)
async def get_job(job_id: str):
    """
    Get the current status and details of a specific job.
    """
    job = await db.jobs.find_one({"job_id": job_id})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    return job_serializer(job)

@router.get("/jobs/", response_model=list)
async def get_user_jobs(user_id: str):
    """
    List all jobs for a specific user.
    """
    jobs_cursor = db.jobs.find({"user_id": user_id})
    jobs = await jobs_cursor.to_list(length=100)
    
    return jobs_serializer(jobs)

@router.get("/jobs/{job_id}/download")
async def download_job_output(
    job_id: str,
    format: str = Query(default="auto", pattern="^(auto|video|ass|srt|vtt|txt)$")
):
    """
    Download a completed job output.
    Defaults to burned video when present, then ASS, then SRT.
    """
    job = await db.jobs.find_one({"job_id": job_id})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.get("status") != JobStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Job is not completed yet")

    if format in {"txt", "vtt"}:
        file_path = _build_text_export(job, job_id, format)
        return FileResponse(
            file_path,
            media_type="text/plain",
            filename=os.path.basename(file_path)
        )

    for field in DOWNLOAD_FIELDS[format]:
        file_path = job.get(field)
        if file_path and os.path.exists(file_path):
            media_type = "video/mp4" if field == "burned_video_path" else "text/plain"
            return FileResponse(
                file_path,
                media_type=media_type,
                filename=os.path.basename(file_path)
            )

    raise HTTPException(status_code=404, detail="Requested output file not found")

@router.delete("/jobs/{job_id}")
async def delete_job(job_id: str):
    """
    Deletes a specific job from the database.
    """
    result = await db.jobs.delete_one({"job_id": job_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Job not found")
        
    return {"message": "Job deleted successfully"}
