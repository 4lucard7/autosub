from faster_whisper import WhisperModel

# load model globally so it doesn't reload on every request
model = WhisperModel("base", compute_type="int8")

def transcribe_audio(audio_path):
    # transcribe the specific audio file passed to the function
    segments, info = model.transcribe(audio_path)

    print("Language identified:", info.language)

    full_text = ""
    for segment in segments:
        print(f"[{segment.start:.2f}s -> {segment.end:.2f}s] {segment.text}")
        full_text += segment.text

    return full_text