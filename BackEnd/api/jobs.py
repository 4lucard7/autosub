from fastapi import APIRouter, HTTPException, BackgroundTasks
from models.Job import Job, JobStatus
from schemas.job_schema import JobCreate, job_serializer, jobs_serializer
from workers.DB import db
import uuid
from datetime import datetime, timezone

router = APIRouter()

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
        subtitle_style=job_data.subtitle_style.dict() if job_data.subtitle_style else None,
        status=JobStatus.PENDING,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    
    # Save job to database. Convert to dict for MongoDB.
    await db.jobs.insert_one(new_job.dict(by_alias=True))
    
    # Trigger the background processing
    from workers.process_video import process_video_task
    background_tasks.add_task(
        process_video_task,
        job_id=job_id,
        video_path=job_data.video_path,
        burn_subtitles=job_data.burn_subtitles,
        subtitle_style=job_data.subtitle_style.dict() if job_data.subtitle_style else None
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

@router.delete("/jobs/{job_id}")
async def delete_job(job_id: str):
    """
    Deletes a specific job from the database.
    """
    result = await db.jobs.delete_one({"job_id": job_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Job not found")
        
    return {"message": "Job deleted successfully"}
