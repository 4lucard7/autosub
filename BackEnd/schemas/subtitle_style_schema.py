from pydantic import BaseModel
from typing import Optional

class SubtitleStyle(BaseModel):
    # Font properties
    font_name: str              # e.g., "Arial"
    font_size: int              # 8-200px
    
    # Text color (BBGGRR hex format for ASS)
    text_color: str             # e.g., "FFFFFF"
    bold: bool                  # True/False
    italic: bool                # True/False
    
    # Alignment (1-9 numpad)
    alignment: int              # 1-9
    
    # Positioning
    margin_l: int               # 0-500px
    margin_r: int               # 0-500px
    margin_v: int               # 0-500px
    
    # Effects
    outline_width: float        # 0-10px
    outline_color: str          # BBGGRR hex
    shadow_depth: float         # 0-10px
    shadow_color: str           # BBGGRR hex
    
    # Background
    background_color: str       # BBGGRR hex
    background_opacity: int     # 0-100%
    
    # Spacing
    letter_spacing: float       # -5 to +10px
    line_spacing: float         # 0-5x multiplier
    
    # Metadata
    preset: str                 # netflix, tiktok, etc.
    name: Optional[str] = None  # Custom name

# Default preset style definitions in BGR format
SUBTITLE_PRESETS = {
    "netflix": SubtitleStyle(
        font_name="Arial",
        font_size=48,
        text_color="FFFFFF",
        bold=False,
        italic=False,
        alignment=2,
        margin_l=0,
        margin_r=0,
        margin_v=30,
        outline_width=2.0,
        outline_color="000000",
        shadow_depth=2.0,
        shadow_color="000000",
        background_color="000000",
        background_opacity=0,
        letter_spacing=0.0,
        line_spacing=0.0,
        preset="netflix",
        name="Netflix"
    ),
    "tiktok": SubtitleStyle(
        font_name="Arial Black",
        font_size=56,
        text_color="FFFFFF",
        bold=True,
        italic=False,
        alignment=5,
        margin_l=10,
        margin_r=10,
        margin_v=50,
        outline_width=4.0,
        outline_color="7F00FF", # Neon Magenta (BGR representation for #FF007F)
        shadow_depth=0.0,
        shadow_color="000000",
        background_color="000000",
        background_opacity=0,
        letter_spacing=1.0,
        line_spacing=0.0,
        preset="tiktok",
        name="TikTok"
    ),
    "youtube_shorts": SubtitleStyle(
        font_name="Impact",
        font_size=64,
        text_color="00FFFF", # Yellow (BGR representation for #FFFF00)
        bold=True,
        italic=False,
        alignment=5,
        margin_l=20,
        margin_r=20,
        margin_v=150,
        outline_width=3.0,
        outline_color="000000",
        shadow_depth=2.0,
        shadow_color="000000",
        background_color="000000",
        background_opacity=0,
        letter_spacing=0.5,
        line_spacing=0.0,
        preset="youtube_shorts",
        name="YouTube Shorts"
    ),
    "gaming": SubtitleStyle(
        font_name="Consolas",
        font_size=40,
        text_color="00FF00", # Neon Green (BGR representation for #00FF00)
        bold=True,
        italic=False,
        alignment=1,
        margin_l=50,
        margin_r=50,
        margin_v=50,
        outline_width=2.5,
        outline_color="000000",
        shadow_depth=1.5,
        shadow_color="000000",
        background_color="000000",
        background_opacity=50,
        letter_spacing=0.0,
        line_spacing=0.0,
        preset="gaming",
        name="Gaming"
    ),
    "cinematic": SubtitleStyle(
        font_name="Georgia",
        font_size=36,
        text_color="F5F5F5", # Elegant off-white (BGR)
        bold=False,
        italic=True,
        alignment=2,
        margin_l=100,
        margin_r=100,
        margin_v=40,
        outline_width=1.0,
        outline_color="1A1A1A",
        shadow_depth=3.0,
        shadow_color="000000",
        background_color="000000",
        background_opacity=0,
        letter_spacing=2.0,
        line_spacing=0.2,
        preset="cinematic",
        name="Cinematic"
    ),
    "minimal": SubtitleStyle(
        font_name="Helvetica",
        font_size=32,
        text_color="FFFFFF",
        bold=False,
        italic=False,
        alignment=2,
        margin_l=0,
        margin_r=0,
        margin_v=30,
        outline_width=0.0,
        outline_color="000000",
        shadow_depth=0.0,
        shadow_color="000000",
        background_color="000000",
        background_opacity=0,
        letter_spacing=1.0,
        line_spacing=0.0,
        preset="minimal",
        name="Minimal"
    ),
    "neon": SubtitleStyle(
        font_name="Impact",
        font_size=52,
        text_color="FFFFFF",
        bold=True,
        italic=False,
        alignment=2,
        margin_l=20,
        margin_r=20,
        margin_v=40,
        outline_width=3.5,
        outline_color="FFFF00", # Neon Cyan (BGR representation for #00FFFF)
        shadow_depth=4.0,
        shadow_color="FF00FF", # Magenta (BGR representation for #FF00FF)
        background_color="000000",
        background_opacity=0,
        letter_spacing=1.5,
        line_spacing=0.0,
        preset="neon",
        name="Neon Cyberpunk"
    )
}
