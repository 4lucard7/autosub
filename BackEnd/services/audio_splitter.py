import subprocess
import os

def split_audio(input_path, chunk_size_secs=600):
    """
    Splits audio into smaller chunks using FFmpeg.
    """
    output_pattern = input_path.replace(".wav", "_chunk%03d.wav")
    
    subprocess.run([
        "ffmpeg", "-i", input_path,
        "-f", "segment",
        "-segment_time", str(chunk_size_secs),
        "-c", "copy",
        output_pattern
    ])
    
    # Return list of created chunks (simplified)
    return [f for f in os.listdir(os.path.dirname(input_path)) if "_chunk" in f]
