import subprocess
import os

# Hardcoded FFmpeg path from your system
FFMPEG_BIN_PATH = r"C:\Users\ALUCARD\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1-full_build\bin"

def extract_audio(video_path: str, audio_path: str):
    """
    Extracts audio from a video file using FFmpeg.
    Converts it to 16kHz mono WAV format for optimal transcription.
    """
    # Ensure FFmpeg is in the system PATH for this process
    if FFMPEG_BIN_PATH not in os.environ["PATH"]:
        os.environ["PATH"] += os.pathsep + FFMPEG_BIN_PATH

    print(f"Extracting audio from: {video_path}")
    
    try:
        subprocess.run([
            "ffmpeg", "-y", 
            "-i", video_path,
            "-ar", "16000",
            "-ac", "1",
            audio_path
        ], check=True, capture_output=True)
        
        print(f"Audio extracted successfully to: {audio_path}")
        return audio_path
    except subprocess.CalledProcessError as e:
        print(f"FFmpeg error: {e.stderr.decode()}")
        raise RuntimeError(f"Failed to extract audio: {e.stderr.decode()}")
