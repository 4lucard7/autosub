import os
import uuid
import subprocess
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from schemas.subtitle_style_schema import SubtitleStyle, SUBTITLE_PRESETS
from workers.DB import db

router = APIRouter()

ABS_PATH = os.path.abspath(os.path.dirname(__file__))
STORAGE_BASE = os.path.abspath(os.path.join(ABS_PATH, "..", "..", "storage"))
OUTPUT_FOLDER = os.path.join(STORAGE_BASE, "outputs")

class PreviewRenderRequest(BaseModel):
    segments: list
    style: SubtitleStyle
    job_id: str

@router.post("/subtitles/styles", response_model=dict)
async def save_subtitle_style(style: SubtitleStyle):
    """
    Saves a custom subtitle style to MongoDB and returns it with a unique style_id.
    """
    style_id = str(uuid.uuid4())
    style_data = style.dict()
    style_data["style_id"] = style_id
    style_data["created_at"] = datetime.now(timezone.utc)
    
    await db.subtitle_styles.insert_one(style_data)
    
    if "_id" in style_data:
        style_data["_id"] = str(style_data["_id"])
        
    return {
        "message": "Subtitle style saved successfully",
        "style_id": style_id,
        "style": style_data
    }

@router.get("/subtitles/styles/{style_id}", response_model=dict)
async def get_subtitle_style(style_id: str):
    """
    Retrieve a saved subtitle style by ID.
    """
    style = await db.subtitle_styles.find_one({"style_id": style_id})
    if not style:
        raise HTTPException(status_code=404, detail="Saved subtitle style not found")
        
    if "_id" in style:
        style["_id"] = str(style["_id"])
    return style

@router.get("/subtitles/presets", response_model=dict)
async def get_subtitle_presets():
    """
    List all available subtitle presets.
    """
    presets_dict = {}
    for key, style_model in SUBTITLE_PRESETS.items():
        presets_dict[key] = {
            "name": style_model.name,
            "style": style_model.dict()
        }
    return {"presets": presets_dict}

@router.get("/subtitles/presets/{preset_name}", response_model=dict)
async def get_subtitle_preset(preset_name: str):
    """
    Retrieve settings for a specific preset name.
    """
    if preset_name not in SUBTITLE_PRESETS:
        raise HTTPException(status_code=404, detail=f"Preset '{preset_name}' not found")
    return SUBTITLE_PRESETS[preset_name].dict()

@router.post("/subtitles/preview/render", response_model=dict)
async def render_preview_ass(request: PreviewRenderRequest):
    """
    Generate the raw ASS content based on segments and the styling options.
    """
    from services.ass_generator import generate_ass
    try:
        ass_content = generate_ass(request.segments, request.style.dict())
        return {"ass_content": ass_content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to render preview: {str(e)}")

@router.post("/subtitles/apply-style/{job_id}", response_model=dict)
async def apply_style_to_job(job_id: str, style: SubtitleStyle):
    """
    Update a job's styling, regenerate the ASS subtitle file, and burn subtitles into the video using FFmpeg.
    """
    # 1. Fetch the job from MongoDB
    job = await db.jobs.find_one({"job_id": job_id})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    # 2. Update style in database
    await db.jobs.update_one(
        {"job_id": job_id},
        {"$set": {
            "subtitle_style": style.dict(),
            "updated_at": datetime.now(timezone.utc)
        }}
    )
    
    # 3. Read segments (fallback to empty list if none exist yet)
    segments = job.get("transcribed_segments") or []
    
    # 4. Generate and save the ASS file
    from services.ass_generator import generate_ass
    ass_content = generate_ass(segments, style.dict())
    
    os.makedirs(OUTPUT_FOLDER, exist_ok=True)
    ass_path = os.path.join(OUTPUT_FOLDER, f"{job_id}.ass")
    with open(ass_path, "w", encoding="utf-8") as f:
        f.write(ass_content)
        
    # 5. Burn subtitles into the video
    video_path = job.get("video_path")
    if not video_path or not os.path.exists(video_path):
        raise HTTPException(status_code=400, detail="Original video file not found")
        
    burned_video_path = os.path.join(OUTPUT_FOLDER, f"{job_id}_burned.mp4")
    
    from services.audio_extractor import FFMPEG_BIN_PATH
    if FFMPEG_BIN_PATH not in os.environ["PATH"]:
        os.environ["PATH"] += os.pathsep + FFMPEG_BIN_PATH
        
    from workers.process_video import _build_subtitles_filter
    try:
        subprocess.run([
            "ffmpeg", "-y",
            "-i", video_path,
            "-vf", _build_subtitles_filter(ass_path),
            burned_video_path
        ], check=True, capture_output=True)
    except subprocess.CalledProcessError as e:
        raise HTTPException(
            status_code=500,
            detail=f"FFmpeg error burning styled subtitles: {e.stderr.decode()}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error burning styled subtitles: {str(e)}"
        )
        
    # 6. Update database with new file paths
    await db.jobs.update_one(
        {"job_id": job_id},
        {"$set": {
            "ass_path": ass_path,
            "burned_video_path": burned_video_path,
            "updated_at": datetime.now(timezone.utc)
        }}
    )
    
    return {
        "message": "Subtitle style applied and video regenerated successfully",
        "ass_path": ass_path,
        "burned_video_path": burned_video_path
    }

@router.get("/subtitles/job/{job_id}/style", response_model=dict)
async def get_job_style(job_id: str):
    """
    Retrieve the current custom subtitle style saved on a job.
    """
    job = await db.jobs.find_one({"job_id": job_id})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    return job.get("subtitle_style") or {}
