import { useState } from 'react'

const FONTS = [
  'Arial', 'Helvetica', 'Georgia', 'Times New Roman',
  'Courier New', 'Verdana', 'Comic Sans MS', 'Trebuchet MS',
  'Impact', 'Lucida Console', 'Consolas', 'Segoe UI'
]

export default function FontSelector({ fontName, fontSize, onFontChange, onSizeChange }) {
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <div className="space-y-4">
      {/* Font Family Selector */}
      <div>
        <label className="text-sm text-gray-300 font-medium block mb-2">Font Family</label>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600/50 rounded-lg text-left text-gray-100 font-medium hover:border-gray-500/70 transition-colors flex items-center justify-between"
          >
            <span>{fontName}</span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600/50 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
              {FONTS.map(font => (
                <button
                  key={font}
                  onClick={() => {
                    onFontChange(font)
                    setShowDropdown(false)
                  }}
                  className={`w-full px-4 py-2.5 text-left font-medium hover:bg-gray-700/50 transition-colors ${
                    fontName === font ? 'bg-blue-600/30 text-blue-300' : 'text-gray-200'
                  }`}
                  style={{ fontFamily: font }}
                >
                  {font}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Font Size Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-300 font-medium">Font Size</label>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-gray-700/50 rounded text-sm text-gray-100 font-mono">
              {fontSize}px
            </span>
          </div>
        </div>
        <input
          type="range"
          min={8}
          max={200}
          value={fontSize}
          onChange={e => onSizeChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>8px</span>
          <span>200px</span>
        </div>
      </div>

      {/* Preview */}
      <div
        className="w-full p-4 bg-gray-900/50 border border-gray-700/30 rounded-lg text-gray-200 text-center"
        style={{
          fontFamily: fontName,
          fontSize: `${Math.min(fontSize / 2, 24)}px`
        }}
      >
        Preview Text
      </div>
    </div>
  )
}
