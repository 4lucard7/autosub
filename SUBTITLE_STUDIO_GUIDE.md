# 🎬 AutoSub Premium Subtitle Styling Studio

A professional-grade subtitle customization system built into AutoSub, enabling content creators to style and brand their subtitles before burning them into videos.

## 🌟 Features

### 1. **Real-Time Live Preview**
- See subtitle changes instantly on a mock video frame
- Preview with extracted video thumbnails or placeholder backgrounds
- Visual feedback for all styling adjustments
- Safe area guides to ensure subtitles are within safe zones

### 2. **Comprehensive Styling Controls**

#### Text Styling
- **Font Selection**: 12+ professional fonts (Arial, Georgia, Helvetica, Consolas, etc.)
- **Font Size**: 8px - 200px with live preview
- **Bold & Italic**: Toggle buttons for text emphasis
- **Letter Spacing**: -5px to +10px for text width adjustment
- **Line Spacing**: 0 to 5x multiplier for vertical line height

#### Colors & Effects
- **Text Color**: Full RGB color picker with presets
- **Outline Color**: Separate control for text outline
- **Outline Width**: 0 - 10px adjustable thickness
- **Shadow Color**: Dedicated shadow color selection
- **Shadow Depth**: 0 - 10px for cinematic depth effects
- **Background Box**: Optional semi-transparent background with opacity control (0-100%)

#### Positioning
- **Alignment**: 9-point alignment grid (like numpad)
  - Top/Middle/Bottom rows
  - Left/Center/Right columns
- **Margins**: Individual left, right, and vertical margins
- **Vertical Offset**: Fine-tune subtitle position from 0-500px

### 3. **Seven Professional Presets**

1. **Netflix** - Classic professional look with strong shadows
2. **TikTok** - Vibrant, bold neon magenta outlines for short-form content
3. **YouTube Shorts** - Optimized for mobile vertical video format
4. **Gaming** - Neon green cyberpunk aesthetic for gaming content
5. **Cinematic** - Film-grade elegant typography with heavy shadows
6. **Minimal** - Clean, distraction-free subtitle styling
7. **Neon Cyberpunk** - Bold cyan outlines with magenta shadows

Each preset applies:
- Ideal font family
- Professional color combinations
- Pre-tuned outline and shadow settings
- Optimal positioning and margins
- Ready-to-use for that platform

### 4. **Advanced ASS Subtitle Format**

Generated ASS (Advanced SubStation Alpha) files support:
- Vector-based font rendering (no pixelation at any size)
- Complex color and transparency effects
- Professional outline and shadow capabilities
- Karaoke-ready subtitle architecture
- Platform-agnostic subtitle delivery

## 🏗️ Architecture

### Backend (FastAPI + Python)

**New Files:**
- `schemas/subtitle_style_schema.py` - SubtitleStyle pydantic model with preset definitions
- `services/ass_generator.py` - Professional ASS file generator with color conversion
- `api/subtitles.py` - RESTful API endpoints for styling operations

**Updated Files:**
- `models/Job.py` - Added subtitle_style, target_lang, transcribed_segments fields
- `main.py` - Registered subtitles router

**API Endpoints:**
```
POST   /subtitles/styles                    - Save custom style
GET    /subtitles/styles/{style_id}         - Retrieve saved style
GET    /subtitles/presets                   - List all presets
GET    /subtitles/presets/{preset_name}     - Get specific preset
POST   /subtitles/preview/render            - Generate preview ASS file
POST   /subtitles/apply-style/{job_id}      - Apply style to job
GET    /subtitles/job/{job_id}/style        - Get job's current style
```

### Frontend (React + TailwindCSS + Framer Motion)

**New Components:**
- `pages/SubtitleStylingStudio.jsx` - Main styling interface page
- `components/SubtitleStudio/SubtitleStylePanel.jsx` - Collapsible style controls
- `components/SubtitleStudio/SubtitlePreview.jsx` - Live preview rendering
- `components/SubtitleStudio/PresetThemes.jsx` - Preset selection panel
- `components/SubtitleStudio/FontSelector.jsx` - Font and size picker
- `components/SubtitleStudio/ColorPicker.jsx` - RGB/Hex color picker
- `components/SubtitleStudio/AlignmentSelector.jsx` - 9-point alignment grid
- `api/subtitles.api.js` - Subtitle API integration

**Updated Files:**
- `App.jsx` - Added `/studio/:jobId` route
- `ProcessingPage.jsx` - Redirects to styling studio after transcription

## 🎨 Design System

### Visual Style
- **Theme**: Cinematic dark mode (gray-900 to gray-950 gradients)
- **Glassmorphism**: Semi-transparent panels with backdrop blur
- **Micro-interactions**: Smooth transitions and hover effects
- **Typography**: Professional sans-serif with monospace code fonts
- **Colors**: Blue accents for active states, emerald for CTAs

### Component Pattern
- Collapsible sections for organization
- Color badges for status indication
- Real-time slider inputs with value displays
- Live preview synchronization
- Preset cards with hover animations

## 🔄 Workflow

### User Flow

1. **Upload Video** → Process uploaded video
2. **Transcription** → AI transcribes video to subtitle segments
3. **Styling Studio** (NEW) → Customize subtitle appearance
   - Browse and apply presets
   - Adjust individual styling parameters
   - See live preview of changes
4. **Apply & Export** → Burn styled subtitles to video
5. **Download** → Get final video with burnt-in subtitles

### Data Flow

```
User Input (Style Changes)
  ↓
SubtitleStylePanel Updates State
  ↓
SubtitlePreview Renders Changes (Real-time)
  ↓
[Apply Button Click]
  ↓
API: POST /subtitles/apply-style/{jobId}
  ↓
Backend: Generate ASS file with SubtitleStyle
  ↓
Backend: Store ASS path in Job model
  ↓
User → Export Page → FFmpeg burns subtitles
  ↓
Download Final Video
```

## 🔧 Technical Details

### SubtitleStyle Model

```python
class SubtitleStyle(BaseModel):
    # Font properties
    font_name: str              # e.g., "Arial"
    font_size: int              # 8-200px
    
    # Text color (BBGGRR hex format for ASS)
    text_color: str             # e.g., "FFFFFF"
    bold: bool                  # True/False
    italic: bool                # True/False
    
    # Alignment (1-9 numpad)
    alignment: TextAlignment    # 1-9
    
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
    preset: SubtitleStylePreset # netflix, tiktok, etc.
    name: Optional[str]         # Custom name
```

### ASS Generation

Generates ASS subtitle files with:
- Script info and playback resolution (1920x1080)
- Custom style definition with all visual parameters
- Dialogue events with timestamps
- Color conversion (RGB ↔ BGR ↔ ASS hex)
- Opacity to alpha channel conversion

### Color Format Handling

```python
# Input: RGB hex (from color picker)
"FFFFFF" (white)

# Convert to BGR (ASS format)
"FFFFFF" (stored internally as BGR)

# In ASS file: &H[Alpha][B][G][R]&
"&H00FFFFFF&" (fully opaque white)
```

## 🚀 Performance Optimization

- **Lazy Component Loading**: Presets load on demand
- **Real-time Debouncing**: Preview updates use requestAnimationFrame
- **Memoization**: SubtitlePreview uses useMemo for style calculations
- **File Streaming**: ASS files generated server-side, not in browser

## 🔮 Future Enhancements

1. **Animated Subtitles**
   - Keyframe-based animations
   - Entrance/exit effects
   - Timing synchronization

2. **Karaoke Subtitles**
   - Word-level highlighting
   - Color cycling per word
   - Beat synchronization

3. **AI Auto-Styling**
   - Automatic style suggestion based on video mood
   - ML-based preset recommendations
   - Sentiment analysis for optimal styling

4. **Subtitle Templates Marketplace**
   - Community-created templates
   - Template sharing and ratings
   - Pre-packaged style bundles

5. **Multi-Language Styling**
   - Language-specific font recommendations
   - Character spacing optimization
   - RTL language support

6. **Batch Styling Operations**
   - Apply style to multiple videos
   - Style templating and inheritance
   - Bulk export with styling

## 📦 Dependencies

### Backend
- `fastapi` - Modern Python web framework
- `pydantic` - Data validation
- `motor` - Async MongoDB driver
- Existing: `ffmpeg-python`

### Frontend
- `react` - UI framework
- `react-router-dom` - Client-side routing
- `framer-motion` - Animation library
- `tailwindcss` - Utility CSS framework
- `axios` - HTTP client

## 🛠️ Development

### Adding Custom Fonts

Update `FontSelector.jsx`:
```javascript
const FONTS = [
  'Arial',
  'CustomFont',  // Add here
  'Georgia',
]
```

### Adding New Presets

Update `subtitle_style_schema.py`:
```python
SUBTITLE_PRESETS = {
    SubtitleStylePreset.CUSTOM_PRESET: SubtitleStyle(
        font_name="Arial",
        font_size=48,
        # ... other settings
    ),
}
```

### Extending ASS Features

ASS files support many advanced features:
- Karaoke timestamps (\k, \K, \kf, \ko)
- Position overrides (\pos, \move)
- Color gradients and complex effects
- Vector drawing
- Animated transitions

## 📄 License

Part of the AutoSub application. See main repository LICENSE.

---

**Built with ❤️ for content creators**
