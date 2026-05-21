from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class TextAlignment(str, Enum):
    """ASS subtitle alignment values (1-9, like numpad)"""
    LEFT_BOTTOM = 1
    CENTER_BOTTOM = 2
    RIGHT_BOTTOM = 3
    LEFT_MIDDLE = 4
    CENTER_MIDDLE = 5
    RIGHT_MIDDLE = 6
    LEFT_TOP = 7
    CENTER_TOP = 8
    RIGHT_TOP = 9


class BorderStyle(str, Enum):
    """ASS border style"""
    OUTLINE = 1
    OPAQUE_BOX = 3


class SubtitleStylePreset(str, Enum):
    """Pre-made subtitle style presets"""
    NETFLIX = "netflix"
    TIKTOK = "tiktok"
    YOUTUBE_SHORTS = "youtube_shorts"
    GAMING = "gaming"
    CINEMATIC = "cinematic"
    MINIMAL = "minimal"
    NEON = "neon"
    CUSTOM = "custom"


class SubtitleStyle(BaseModel):
    """Complete subtitle styling configuration"""
    
    # Font properties
    font_name: str = Field(default="Arial", description="Font family name")
    font_size: int = Field(default=48, ge=8, le=200, description="Font size in pixels")
    
    # Text color (RGB hex format: BBGGRR for ASS format)
    text_color: str = Field(default="FFFFFF", description="Text color in hex BBGGRR format")
    bold: bool = Field(default=False, description="Bold text")
    italic: bool = Field(default=False, description="Italic text")
    
    # Alignment (1-9, numpad layout)
    alignment: TextAlignment = Field(default=TextAlignment.CENTER_BOTTOM, description="Text alignment")
    
    # Positioning
    margin_l: int = Field(default=0, ge=0, le=500, description="Left margin in pixels")
    margin_r: int = Field(default=0, ge=0, le=500, description="Right margin in pixels")
    margin_v: int = Field(default=30, ge=0, le=500, description="Vertical margin in pixels")
    
    # Outline/Shadow properties
    outline_width: float = Field(default=2.0, ge=0, le=10, description="Outline width")
    outline_color: str = Field(default="000000", description="Outline color in hex BBGGRR format")
    shadow_depth: float = Field(default=0, ge=0, le=10, description="Shadow depth")
    shadow_color: str = Field(default="000000", description="Shadow color in hex BBGGRR format")
    
    # Background box
    background_color: str = Field(default="000000", description="Background box color in hex BBGGRR format")
    background_opacity: int = Field(default=0, ge=0, le=100, description="Background opacity percentage")
    
    # Letter and line spacing
    letter_spacing: float = Field(default=0, ge=-5, le=10, description="Letter spacing")
    line_spacing: float = Field(default=0, description="Line spacing multiplier")
    
    # Metadata
    preset: SubtitleStylePreset = Field(default=SubtitleStylePreset.CUSTOM, description="Preset name")
    name: Optional[str] = Field(default=None, description="Custom style name")


# Preset configurations
SUBTITLE_PRESETS = {
    SubtitleStylePreset.NETFLIX: SubtitleStyle(
        font_name="Segoe UI",
        font_size=54,
        text_color="FFFFFF",
        bold=False,
        italic=False,
        alignment=TextAlignment.CENTER_BOTTOM,
        outline_width=2,
        outline_color="000000",
        shadow_depth=3,
        shadow_color="000000",
        background_opacity=0,
        margin_v=40,
        preset=SubtitleStylePreset.NETFLIX,
        name="Netflix Classic"
    ),
    SubtitleStylePreset.TIKTOK: SubtitleStyle(
        font_name="Arial",
        font_size=56,
        text_color="FFFFFF",
        bold=True,
        italic=False,
        alignment=TextAlignment.CENTER_BOTTOM,
        outline_width=3,
        outline_color="FF00FF",  # Neon magenta outline
        shadow_depth=0,
        background_opacity=20,
        background_color="000000",
        margin_v=50,
        preset=SubtitleStylePreset.TIKTOK,
        name="TikTok Vibrant"
    ),
    SubtitleStylePreset.YOUTUBE_SHORTS: SubtitleStyle(
        font_name="Arial",
        font_size=52,
        text_color="FFFFFF",
        bold=True,
        italic=False,
        alignment=TextAlignment.CENTER_BOTTOM,
        outline_width=2.5,
        outline_color="000000",
        shadow_depth=2,
        shadow_color="000000",
        background_opacity=30,
        background_color="000000",
        margin_v=45,
        preset=SubtitleStylePreset.YOUTUBE_SHORTS,
        name="YouTube Shorts"
    ),
    SubtitleStylePreset.GAMING: SubtitleStyle(
        font_name="Consolas",
        font_size=50,
        text_color="00FF00",  # Neon green
        bold=True,
        italic=False,
        alignment=TextAlignment.CENTER_BOTTOM,
        outline_width=2,
        outline_color="00AA00",
        shadow_depth=4,
        shadow_color="000000",
        background_opacity=50,
        background_color="001100",
        margin_v=40,
        preset=SubtitleStylePreset.GAMING,
        name="Gaming Neon"
    ),
    SubtitleStylePreset.CINEMATIC: SubtitleStyle(
        font_name="Georgia",
        font_size=48,
        text_color="FFFFFF",
        bold=False,
        italic=False,
        alignment=TextAlignment.CENTER_BOTTOM,
        outline_width=3,
        outline_color="000000",
        shadow_depth=5,
        shadow_color="000000",
        background_opacity=0,
        margin_v=60,
        line_spacing=1.2,
        preset=SubtitleStylePreset.CINEMATIC,
        name="Cinematic Elite"
    ),
    SubtitleStylePreset.MINIMAL: SubtitleStyle(
        font_name="Helvetica",
        font_size=44,
        text_color="CCCCCC",
        bold=False,
        italic=False,
        alignment=TextAlignment.CENTER_BOTTOM,
        outline_width=0,
        outline_color="000000",
        shadow_depth=0,
        background_opacity=0,
        margin_v=35,
        preset=SubtitleStylePreset.MINIMAL,
        name="Minimal Clean"
    ),
    SubtitleStylePreset.NEON: SubtitleStyle(
        font_name="Arial",
        font_size=54,
        text_color="00FFFF",  # Cyan
        bold=True,
        italic=False,
        alignment=TextAlignment.CENTER_BOTTOM,
        outline_width=4,
        outline_color="FF00FF",  # Magenta
        shadow_depth=8,
        shadow_color="FF00FF",
        background_opacity=15,
        background_color="000000",
        margin_v=45,
        preset=SubtitleStylePreset.NEON,
        name="Neon Cyberpunk"
    ),
}


def get_preset(preset_name: SubtitleStylePreset) -> SubtitleStyle:
    """Get a preset style configuration"""
    return SUBTITLE_PRESETS.get(preset_name, SUBTITLE_PRESETS[SubtitleStylePreset.NETFLIX])
