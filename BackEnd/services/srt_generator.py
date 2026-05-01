def generate_srt(segments):
    """
    Generates SRT format text from whisper segments.
    """
    srt_content = ""
    for i, segment in enumerate(segments, start=1):
        start = format_timestamp(segment.start)
        end = format_timestamp(segment.end)
        srt_content += f"{i}\n{start} --> {end}\n{segment.text.strip()}\n\n"
    return srt_content

def format_timestamp(seconds):
    td = float(seconds)
    hours = int(td // 3600)
    minutes = int((td % 3600) // 60)
    secs = int(td % 60)
    millis = int((td % 1) * 1000)
    return f"{hours:02}:{minutes:02}:{secs:02},{millis:03}"
