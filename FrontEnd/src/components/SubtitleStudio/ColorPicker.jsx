import { useState, useRef, useEffect } from 'react'

// Convert BBGGRR (ASS format) to standard RGB hex format for display
function bgrToRgb(bgr) {
  if (!bgr || bgr.length !== 6) return '#FFFFFF'
  const b = bgr.slice(0, 2)
  const g = bgr.slice(2, 4)
  const r = bgr.slice(4, 6)
  return `#${r}${g}${b}`
}

// Convert RGB hex to BBGGRR (ASS format)
function rgbToBgr(rgb) {
  const hex = rgb.replace('#', '')
  if (hex.length !== 6) return 'FFFFFF'
  const r = hex.slice(0, 2)
  const g = hex.slice(2, 4)
  const b = hex.slice(4, 6)
  return `${b}${g}${r}`.toUpperCase()
}

export default function ColorPicker({ color, onChange }) {
  const [showPicker, setShowPicker] = useState(false)
  const [displayColor, setDisplayColor] = useState(bgrToRgb(color))
  const pickerRef = useRef(null)

  useEffect(() => {
    setDisplayColor(bgrToRgb(color))
  }, [color])

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = e => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false)
      }
    }

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showPicker])

  const handleColorChange = e => {
    const rgb = e.target.value
    setDisplayColor(rgb)
    onChange(rgbToBgr(rgb))
  }

  const PRESET_COLORS = [
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Black', hex: '#000000' },
    { name: 'Red', hex: '#FF0000' },
    { name: 'Green', hex: '#00FF00' },
    { name: 'Blue', hex: '#0000FF' },
    { name: 'Yellow', hex: '#FFFF00' },
    { name: 'Cyan', hex: '#00FFFF' },
    { name: 'Magenta', hex: '#FF00FF' },
    { name: 'Gray', hex: '#808080' },
  ]

  return (
    <div className="relative" ref={pickerRef}>
      {/* Color Button */}
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="w-full flex items-center gap-3 px-4 py-2.5 bg-gray-700/50 border border-gray-600/50 rounded-lg hover:border-gray-500/70 transition-colors"
      >
        <div
          className="w-8 h-8 rounded border-2 border-gray-500/50 shadow-inner"
          style={{ backgroundColor: displayColor }}
        />
        <span className="text-gray-200 font-mono text-sm flex-1 text-left">
          {displayColor.toUpperCase()}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${showPicker ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Color Picker Dropdown */}
      {showPicker && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-gray-800 border border-gray-600/50 rounded-lg shadow-xl z-50 space-y-3">
          {/* Native Color Picker */}
          <div>
            <label className="text-xs text-gray-400 block mb-2">Custom Color</label>
            <input
              type="color"
              value={displayColor}
              onChange={handleColorChange}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>

          {/* Preset Colors */}
          <div>
            <label className="text-xs text-gray-400 block mb-2">Quick Select</label>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_COLORS.map(preset => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setDisplayColor(preset.hex)
                    onChange(rgbToBgr(preset.hex))
                    setShowPicker(false)
                  }}
                  className="flex flex-col items-center gap-1 p-2 rounded hover:bg-gray-700/50 transition-colors"
                  title={preset.name}
                >
                  <div
                    className="w-6 h-6 rounded border border-gray-500/50"
                    style={{ backgroundColor: preset.hex }}
                  />
                  <span className="text-xs text-gray-400">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hex Input */}
          <div>
            <label className="text-xs text-gray-400 block mb-1">Hex Value</label>
            <input
              type="text"
              value={displayColor}
              onChange={e => {
                const val = e.target.value
                if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                  setDisplayColor(val)
                  onChange(rgbToBgr(val))
                }
              }}
              placeholder="#FFFFFF"
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded text-gray-100 text-sm font-mono focus:outline-none focus:border-blue-500/50"
            />
          </div>
        </div>
      )}
    </div>
  )
}
