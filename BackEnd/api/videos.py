from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from models.Video import Video
from schemas.video_schema import video_serializer, videos_serializer
from workers.DB import db
import os
import shutil
import uuid
from datetime import datetime, timezone

router = APIRouter()

# Use the same storage base as main.py
ABS_PATH = os.path.abspath(os.path.dirname(__file__))
STORAGE_BASE = os.path.abspath(os.path.join(ABS_PATH, "..", "..", "storage"))
UPLOAD_FOLDER = os.path.join(STORAGE_BASE, "uploads")

@router.post("/videos/upload", response_model=dict)
async def upload_video(
    user_id: str = Form(...),
    file: UploadFile = File(...)
):
    """
    Upload a video file, save it to disk, and create a DB record.
    """
    # Ensure upload folder exists at the moment of upload
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    
    # Generate a unique video ID
    video_id = str(uuid.uuid4())
    
    # Create a safe filename and path
    extension = os.path.splitext(file.filename)[1]
    safe_filename = f"{video_id}{extension}"
    video_path = os.path.join(UPLOAD_FOLDER, safe_filename)

    # Save the file to disk
    try:
        with open(video_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        file_size = os.path.getsize(video_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save video: {str(e)}")

    # Create the Video DB model
    new_video = Video(
        video_id=video_id,
        user_id=user_id,
        original_filename=file.filename,
        video_path=video_path,
        size_bytes=file_size,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )

    # Save to MongoDB
    result = await db.videos.insert_one(new_video.dict(by_alias=True))
    
    # Retrieve the inserted document to get the _id
    inserted_video = await db.videos.find_one({"_id": result.inserted_id})

    return {
        "message": "Video uploaded successfully",
        "video": video_serializer(inserted_video)
    }

@router.get("/videos/{video_id}", response_model=dict)
async def get_video(video_id: str):
    """
    Retrieve metadata for a specific uploaded video.
    """
    video = await db.videos.find_one({"video_id": video_id})
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
        
    return video_serializer(video)

@router.get("/videos/user/{user_id}", response_model=list)
async def get_user_videos(user_id: str):
    """
    Retrieve all videos uploaded by a specific user.
    """
    videos_cursor = db.videos.find({"user_id": user_id})
    videos = await videos_cursor.to_list(length=100)
    
    return videos_serializer(videos)
