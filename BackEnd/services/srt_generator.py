def generate_srt(segments):
    """
    Generates SRT format text from whisper segments.
    """
    srt_content = ""
    for i, segment in enumerate(segments, start=1):
        # Handle both objects (Whisper) and dicts (our internal format)
        if isinstance(segment, dict):
            start = format_timestamp(segment.get('start', 0))
            end = format_timestamp(segment.get('end', 0))
            text = segment.get('text', '').strip()
        else:
            start = format_timestamp(segment.start)
            end = format_timestamp(segment.end)
            text = segment.text.strip()
            
        srt_content += f"{i}\n{start} --> {end}\n{text}\n\n"
    return srt_content

def format_timestamp(seconds):
    td = float(seconds)
    hours = int(td // 3600)
    minutes = int((td % 3600) // 60)
    secs = int(td % 60)
    millis = int((td % 1) * 1000)
    return f"{hours:02}:{minutes:02}:{secs:02},{millis:03}"
