def transcribe_audio(audio_path):
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        raise RuntimeError(
            "faster-whisper is not installed. "
            "Run: pip install faster-whisper"
        )

    # Load model on first use — "base" is fast; swap for "small" or "medium" for better accuracy
    model = WhisperModel("base", compute_type="int8")

    segments, info = model.transcribe(audio_path)

    print("Language identified:", info.language)

    results = []
    for segment in segments:
        print(f"[{segment.start:.2f}s -> {segment.end:.2f}s] {segment.text}")
        results.append({
            "start": segment.start,
            "end": segment.end,
            "text": segment.text
        })

    return results