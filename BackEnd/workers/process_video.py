import os
from services.audio_extractor import extract_audio
from services.transcription import transcribe_audio
from services.translation_manager import translate_text
from models.Job import JobStatus
from workers.DB import db

STORAGE_BASE = os.path.join(os.path.dirname(__file__), "..", "..", "storage")
OUTPUT_FOLDER = os.path.join(STORAGE_BASE, "outputs")
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

async def process_video_task(job_id: str, video_path: str, target_lang: str = "fr"):
    """
    Background task to process the video: extract audio, transcribe, and translate.
    Updates the database with the final status.
    """
    try:
        # Update status to PROCESSING
        await db.jobs.update_one(
            {"job_id": job_id},
            {"$set": {"status": JobStatus.PROCESSING}}
        )

        filename = os.path.basename(video_path)
        audio_path = os.path.join(OUTPUT_FOLDER, f"{filename}.wav")

        # 1. Extract Audio
        extract_audio(video_path, audio_path)

        # 2. Transcription
        original_text = transcribe_audio(audio_path)

        # 3. Translation
        translated_text = translate_text(original_text, target_lang=target_lang)

        # Update status to COMPLETED and save results
        await db.jobs.update_one(
            {"job_id": job_id},
            {"$set": {
                "status": JobStatus.COMPLETED,
                "audio_path": audio_path,
                "original_text": original_text,
                "translated_text": translated_text,
                "target_lang": target_lang
            }}
        )
        
    except Exception as e:
        # If any error occurs, mark job as FAILED
        await db.jobs.update_one(
            {"job_id": job_id},
            {"$set": {
                "status": JobStatus.FAILED,
                "error_message": str(e)
            }}
        )
