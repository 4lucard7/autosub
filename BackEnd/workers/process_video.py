import os
import subprocess
from models.Job import JobStatus
from workers.DB import db

STORAGE_BASE = os.path.join(os.path.dirname(__file__), "..", "..", "storage")
OUTPUT_FOLDER = os.path.join(STORAGE_BASE, "outputs")
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

from services.audio_extractor import FFMPEG_BIN_PATH


def _ensure_ffmpeg_in_path():
    if FFMPEG_BIN_PATH not in os.environ["PATH"]:
        os.environ["PATH"] += os.pathsep + FFMPEG_BIN_PATH


def _build_subtitles_filter(path: str) -> str:
    safe_path = path.replace('\\', '\\\\')
    safe_path = safe_path.replace("'", "\\'")
    safe_path = safe_path.replace(':', '\\:')
    safe_path = safe_path.replace(',', '\\,')
    safe_path = safe_path.replace('=', '\\=')
    return f"subtitles=filename='{safe_path}'"


async def process_video_task(job_id: str, video_path: str, burn_subtitles: bool = False, source_lang: str = "auto", target_lang: str = "fr", subtitle_style: dict = None):
    """
    Background task to process the video: extract audio, transcribe, and translate.
    Updates the database with the final status.
    """
    try:
        # Lazy imports — so missing ML packages don't crash server startup
        from services.audio_extractor import extract_audio
        from services.translation_manager import translate_segments
        from faster_whisper import WhisperModel

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
        model = WhisperModel("base", compute_type="int8")
        
        # Guide Whisper transcription if source language is explicitly chosen
        transcribe_opts = {}
        if source_lang and source_lang != "auto":
            transcribe_opts["language"] = source_lang
            
        segments_generator, info = model.transcribe(audio_path, **transcribe_opts)
        
        # Whisper auto-detected language is in info.language
        detected_lang = info.language
        
        # Use user-selected source language or fallback to detected language
        translation_source = source_lang if (source_lang and source_lang != "auto") else detected_lang
        
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
        translated_segments = translate_segments(segments, target_lang=target_lang, source_lang=translation_source)

        # 4. Generate SRT File
        from services.srt_generator import generate_srt
        srt_content = generate_srt(translated_segments)
        srt_path = os.path.join(OUTPUT_FOLDER, f"{job_id}.srt")
        
        with open(srt_path, "w", encoding="utf-8") as f:
            f.write(srt_content)

        # 4b. Generate ASS Subtitle File if subtitle styling is provided
        ass_path = None
        if subtitle_style:
            from services.ass_generator import generate_ass
            ass_content = generate_ass(translated_segments, subtitle_style)
            ass_path = os.path.join(OUTPUT_FOLDER, f"{job_id}.ass")
            with open(ass_path, "w", encoding="utf-8") as f:
                f.write(ass_content)

        burned_video_path = None
        if burn_subtitles:
            burned_video_path = os.path.join(OUTPUT_FOLDER, f"{job_id}_burned.mp4")
            _ensure_ffmpeg_in_path()
            # If ASS exists, use it for styled rendering, otherwise fallback to SRT
            sub_to_burn = ass_path if ass_path and os.path.exists(ass_path) else srt_path
            try:
                subprocess.run([
                    "ffmpeg", "-y",
                    "-i", video_path,
                    "-vf", _build_subtitles_filter(sub_to_burn),
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
                "srt_path": srt_path,
                "ass_path": ass_path,
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
