from fastapi import FastAPI, UploadFile, File, Form
import shutil
import subprocess
import os
from services.audio_extractor import extract_audio
from services.transcription import transcribe_audio
from services.translation_manager import translate_text

app = FastAPI()

# Point to the new storage directory structure
STORAGE_BASE = os.path.join(os.path.dirname(__file__), "..", "storage")
UPLOAD_FOLDER = os.path.join(STORAGE_BASE, "uploads")
OUTPUT_FOLDER = os.path.join(STORAGE_BASE, "outputs")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

@app.post("/process/")
async def process_video(
    file: UploadFile = File(...),
    target_lang: str = Form("fr")  # Default to French
):
    video_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(video_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    audio_path = os.path.join(OUTPUT_FOLDER, f"{file.filename}.wav")

    # 1. Extract Audio
    extract_audio(video_path, audio_path)

    # 2. Transcription
    original_text = transcribe_audio(audio_path)

    # 3. Translation
    translated_text = translate_text(original_text, target_lang=target_lang)

    return {
        "message": "Processing complete",
        "original_text": original_text,
        "translated_text": translated_text,
        "target_lang": target_lang
    }