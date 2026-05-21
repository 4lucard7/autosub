import { useMemo } from 'react'

const ALIGNMENT_MAP = {
  7: 'top-0 left-0',
  8: 'top-0 left-1/2 -translate-x-1/2',
  9: 'top-0 right-0',
  4: 'top-1/2 left-0 -translate-y-1/2',
  5: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  6: 'top-1/2 right-0 -translate-y-1/2',
  1: 'bottom-0 left-0',
  2: 'bottom-0 left-1/2 -translate-x-1/2',
  3: 'bottom-0 right-0',
}

const TEXT_ALIGN_MAP = {
  7: 'text-left',
  8: 'text-center',
  9: 'text-right',
  4: 'text-left',
  5: 'text-center',
  6: 'text-right',
  1: 'text-left',
  2: 'text-center',
  3: 'text-right',
}

// Convert BBGGRR to RGB hex
function bgrToRgb(bgr) {
  if (!bgr || bgr.length !== 6) return '#FFFFFF'
  const b = bgr.slice(0, 2)
  const g = bgr.slice(2, 4)
  const r = bgr.slice(4, 6)
  return `#${r}${g}${b}`
}

export default function SubtitlePreview({ style, previewText, videoPath }) {
  const previewStyle = useMemo(() => {
    const baseColor = bgrToRgb(style.text_color)
    const outlineColor = bgrToRgb(style.outline_color)
    const bgColor = bgrToRgb(style.background_color)
    const shadowColor = bgrToRgb(style.shadow_color)

    // Calculate total shadow based on outline and shadow depth
    const totalShadow = (style.outline_width || 0) + (style.shadow_depth || 0)

    return {
      fontFamily: style.font_name,
      fontSize: `${style.font_size}px`,
      color: baseColor,
      fontWeight: style.bold ? 'bold' : 'normal',
      fontStyle: style.italic ? 'italic' : 'normal',
      letterSpacing: `${style.letter_spacing || 0}px`,
      lineHeight: style.line_spacing ? `${1 + (style.line_spacing || 0)}` : '1.3',
      // Text shadow for outline and depth effect
      textShadow: totalShadow > 0
        ? `
          ${Array.from({ length: Math.ceil(totalShadow) }, (_, i) => {
            const offset = i + 1
            return `
              ${offset}px ${offset}px ${offset}px ${shadowColor},
              -${offset}px ${offset}px ${offset}px ${shadowColor},
              ${offset}px -${offset}px ${offset}px ${shadowColor},
              -${offset}px -${offset}px ${offset}px ${shadowColor}
            `
          }).join(',')}
        `
        : 'none',
      // Background box styling
      backgroundColor: style.background_opacity > 0 ? bgColor : 'transparent',
      padding: style.background_opacity > 0 ? '12px 24px' : '0',
      borderRadius: style.background_opacity > 0 ? '8px' : '0',
      backgroundOpacity: style.background_opacity > 0 ? (100 - style.background_opacity) / 100 : 1,
    }
  }, [style])

  const alignmentClass = ALIGNMENT_MAP[style.alignment] || ALIGNMENT_MAP[2]
  const textAlignClass = TEXT_ALIGN_MAP[style.alignment] || TEXT_ALIGN_MAP[2]

  return (
    <div className="flex flex-col gap-3">
      {/* Preview Frame */}
      <div className="relative w-full aspect-video bg-gradient-to-br from-gray-900 to-black rounded-xl border-2 border-gray-700/50 overflow-hidden shadow-2xl">
        {/* Video Background or Placeholder */}
        {videoPath ? (
          <video
            src={videoPath}
            className="w-full h-full object-cover"
            muted
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-2">🎬</div>
              <p className="text-gray-400">Video Preview</p>
            </div>
          </div>
        )}

        {/* Subtitle Preview Overlay */}
        <div className={`absolute ${alignmentClass} w-full px-6 transition-all`}
          style={{
            marginLeft: `${style.margin_l}px`,
            marginRight: `${style.margin_r}px`,
            marginBottom: `${style.margin_v}px`,
            marginTop: `${style.margin_v}px`,
          }}
        >
          <div
            className={`${textAlignClass} backdrop-blur-sm`}
            style={previewStyle}
          >
            {previewText}
          </div>
        </div>

        {/* Safe Area Guides */}
        <div className="absolute inset-0 pointer-events-none border-4 border-dashed border-yellow-500/20" />
        <div className="absolute inset-12 pointer-events-none border border-dashed border-green-500/20" />
      </div>

      {/* Style Info Badge */}
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
        <div className="bg-gray-800/50 rounded p-2 border border-gray-700/30">
          <div className="font-mono">{style.font_name}</div>
          <div className="text-gray-500">{style.font_size}px</div>
        </div>
        <div className="bg-gray-800/50 rounded p-2 border border-gray-700/30">
          <div className="font-mono">#{bgrToRgb(style.text_color).slice(1)}</div>
          <div className="text-gray-500">Text Color</div>
        </div>
      </div>

      {/* Tip */}
      <p className="text-xs text-gray-500 text-center italic">
        ✨ Live preview updates in real-time
      </p>
    </div>
  )
}
