import os
import subprocess
import shutil
from models.Job import JobStatus
from workers.DB import db

STORAGE_BASE = os.path.join(os.path.dirname(__file__), "..", "..", "storage")
OUTPUT_FOLDER = os.path.join(STORAGE_BASE, "outputs")
os.makedirs(OUTPUT_FOLDER, exist_ok=True)


def _ensure_ffmpeg_in_path():
    if shutil.which('ffmpeg') is None:
        raise RuntimeError('ffmpeg is not available in PATH')


def _build_subtitles_filter(srt_path: str) -> str:
    # Use forward slashes for ffmpeg and escape colons if present
    p = srt_path.replace('\\', '/')
    return f"subtitles={p}"


async def process_video_task(job_id: str, video_path: str, target_lang: str = "fr", burn_subtitles: bool = False):
    """
    Background task to process the video: extract audio, transcribe, and translate.
    Updates the database with the final status.
    """
    try:
        # Lazy imports — so missing ML packages don't crash server startup
        from services.audio_extractor import extract_audio
        from services.transcription import transcribe_audio
        from services.translation_manager import translate_text

        # Update status to PROCESSING
        await db.jobs.update_one(
            {"job_id": job_id},
            {"$set": {"status": JobStatus.PROCESSING}}
        )

        filename = os.path.basename(video_path)
        audio_path = os.path.join(OUTPUT_FOLDER, f"{filename}.wav")

        # 1. Extract Audio
        extract_audio(video_path, audio_path)

        # 2. Transcription (Returns segments with timestamps)
        from faster_whisper import WhisperModel
        
        # We manually iterate here to update the DB live
        model = WhisperModel("base", compute_type="int8")
        segments_generator, info = model.transcribe(audio_path)
        
        segments = []
        for segment in segments_generator:
            seg_data = {
                "start": segment.start,
                "end": segment.end,
                "text": segment.text
            }
            segments.append(seg_data)
            
            # Live Update: Push current segments to DB so frontend can show them
            await db.jobs.update_one(
                {"job_id": job_id},
                {"$set": {"transcribed_segments": segments}}
            )

        # 3. Translation (Translates text inside segments)
        from services.translation_manager import translate_segments
        translated_segments = translate_segments(segments, target_lang=target_lang)

        # 4. Generate SRT File
        from services.srt_generator import generate_srt
        srt_content = generate_srt(translated_segments)
        srt_path = os.path.join(OUTPUT_FOLDER, f"{job_id}.srt")
        
        with open(srt_path, "w", encoding="utf-8") as f:
            f.write(srt_content)

        # 5. Generate translated text file
        txt_content = "\n".join(segment.get("text", "").strip() for segment in translated_segments if segment.get("text") is not None)
        txt_path = os.path.join(OUTPUT_FOLDER, f"{job_id}.txt")
        with open(txt_path, "w", encoding="utf-8") as f:
            f.write(txt_content)

        burned_video_path = None
        if burn_subtitles:
            burned_video_path = os.path.join(OUTPUT_FOLDER, f"{job_id}_burned.mp4")
            _ensure_ffmpeg_in_path()
            try:
                subprocess.run([
                    "ffmpeg", "-y",
                    "-i", video_path,
                    "-vf", _build_subtitles_filter(srt_path),
                    burned_video_path
                ], check=True, capture_output=True)
            except subprocess.CalledProcessError as e:
                raise RuntimeError(f"Failed to burn subtitles: {e.stderr.decode()}")

        # Update status to COMPLETED and save results
        await db.jobs.update_one(
            {"job_id": job_id},
            {"$set": {
                "status": JobStatus.COMPLETED,
                "audio_path": audio_path,
                "txt_path": txt_path,
                "burned_video_path": burned_video_path,
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
