"""
Subtitle Styling API Endpoints
Handles subtitle styling, previews, and preset management
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import List, Optional
from schemas.subtitle_style_schema import (
    SubtitleStyle, 
    SubtitleStylePreset,
    SUBTITLE_PRESETS,
    get_preset
)
from workers.DB import db
import os
import uuid
from datetime import datetime, timezone
from services.ass_generator import generate_ass_file

router = APIRouter(prefix="/subtitles", tags=["Subtitles"])


@router.post("/styles", response_model=dict)
async def save_subtitle_style(style: SubtitleStyle):
    """
    Save a custom subtitle style to the database
    Returns the style with an ID
    """
    try:
        style_id = str(uuid.uuid4())
        
        style_dict = style.dict()
        style_dict["_id"] = style_id
        style_dict["created_at"] = datetime.now(timezone.utc)
        
        await db.subtitle_styles.insert_one(style_dict)
        
        return {
            "id": style_id,
            "message": "Style saved successfully",
            "style": style_dict
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save style: {str(e)}")


@router.get("/styles/{style_id}", response_model=dict)
async def get_subtitle_style(style_id: str):
    """
    Retrieve a saved subtitle style by ID
    """
    try:
        style = await db.subtitle_styles.find_one({"_id": style_id})
        if not style:
            raise HTTPException(status_code=404, detail="Style not found")
        
        return {
            "id": style.get("_id"),
            "style": style
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/presets", response_model=dict)
async def get_preset_styles():
    """
    Get all available preset subtitle styles
    """
    presets = {}
    for preset_name, preset_style in SUBTITLE_PRESETS.items():
        presets[preset_name.value] = {
            "name": preset_style.name or preset_name.value,
            "preset": preset_name.value,
            "style": preset_style.dict()
        }
    
    return {
        "message": "Preset styles retrieved successfully",
        "presets": presets,
        "count": len(presets)
    }


@router.get("/presets/{preset_name}", response_model=dict)
async def get_preset_style(preset_name: str):
    """
    Get a specific preset style by name
    """
    try:
        preset_enum = SubtitleStylePreset(preset_name)
        preset_style = get_preset(preset_enum)
        
        return {
            "name": preset_style.name or preset_name,
            "preset": preset_name,
            "style": preset_style.dict()
        }
    except ValueError:
        available = [p.value for p in SubtitleStylePreset]
        raise HTTPException(
            status_code=404, 
            detail=f"Preset '{preset_name}' not found. Available: {available}"
        )


@router.post("/preview/render", response_model=dict)
async def render_preview(
    segments: List[dict],
    style: SubtitleStyle,
    job_id: Optional[str] = None
):
    """
    Generate a preview ASS file for real-time visualization
    This doesn't burn into video, just creates the ASS file for preview
    """
    try:
        if not segments:
            raise HTTPException(status_code=400, detail="No segments provided")
        
        # Create temporary preview file
        preview_id = job_id or str(uuid.uuid4())
        STORAGE_BASE = os.path.abspath(os.path.join(
            os.path.dirname(__file__), "..", "..", "storage"
        ))
        preview_folder = os.path.join(STORAGE_BASE, "previews")
        os.makedirs(preview_folder, exist_ok=True)
        
        preview_path = os.path.join(preview_folder, f"{preview_id}_preview.ass")
        
        # Generate ASS file with the style
        generate_ass_file(
            segments=segments,
            style=style,
            output_path=preview_path,
            title="AutoSub Preview"
        )
        
        return {
            "message": "Preview generated successfully",
            "preview_id": preview_id,
            "preview_path": preview_path,
            "ass_url": f"/storage/previews/{preview_id}_preview.ass"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Preview generation failed: {str(e)}")


@router.post("/apply-style/{job_id}", response_model=dict)
async def apply_style_to_job(
    job_id: str,
    style: SubtitleStyle,
    background_tasks: BackgroundTasks
):
    """
    Apply a subtitle style to an existing job
    This will regenerate the ASS file and optionally burn subtitles
    """
    try:
        # Get the job
        job = await db.jobs.find_one({"job_id": job_id})
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        # Update job with new style
        await db.jobs.update_one(
            {"job_id": job_id},
            {
                "$set": {
                    "subtitle_style": style.dict(),
                    "updated_at": datetime.now(timezone.utc)
                }
            }
        )
        
        # Regenerate ASS file if we have transcribed segments
        if job.get("transcribed_segments"):
            STORAGE_BASE = os.path.abspath(os.path.join(
                os.path.dirname(__file__), "..", "..", "storage"
            ))
            output_folder = os.path.join(STORAGE_BASE, "outputs")
            os.makedirs(output_folder, exist_ok=True)
            
            ass_path = os.path.join(output_folder, f"{job_id}.ass")
            
            generate_ass_file(
                segments=job["transcribed_segments"],
                style=style,
                output_path=ass_path,
                title=f"AutoSub - {job_id}"
            )
            
            # Update job with new ASS path
            await db.jobs.update_one(
                {"job_id": job_id},
                {"$set": {"ass_path": ass_path}}
            )
        
        return {
            "message": "Style applied successfully",
            "job_id": job_id,
            "style_applied": True
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to apply style: {str(e)}")


@router.get("/job/{job_id}/style", response_model=dict)
async def get_job_style(job_id: str):
    """
    Get the current subtitle style for a job
    """
    try:
        job = await db.jobs.find_one({"job_id": job_id})
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        current_style = job.get("subtitle_style") or {}
        
        return {
            "job_id": job_id,
            "current_style": current_style,
            "has_style": bool(current_style)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
