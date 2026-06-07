import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const PRESET_DEFINITIONS = [
  {
    id: 'netflix',
    name: 'Netflix',
    icon: '🎬',
    description: 'Classic, professional look used by Netflix',
    color: 'from-red-600 to-red-500'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    description: 'Vibrant, modern style for short-form videos',
    color: 'from-pink-600 to-purple-600'
  },
  {
    id: 'youtube_shorts',
    name: 'YouTube Shorts',
    icon: '📱',
    description: 'Optimized for YouTube Shorts platform',
    color: 'from-red-600 to-pink-600'
  },
  {
    id: 'gaming',
    name: 'Gaming',
    icon: '🎮',
    description: 'Neon green cyberpunk style for gamers',
    color: 'from-green-600 to-emerald-600'
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    icon: '🎞️',
    description: 'Film-grade look with elegant typography',
    color: 'from-slate-700 to-slate-600'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    icon: '✨',
    description: 'Clean and simple, focus on content',
    color: 'from-gray-600 to-gray-500'
  },
  {
    id: 'neon',
    name: 'Neon Cyberpunk',
    icon: '🌐',
    description: 'Bold neon colors for maximum impact',
    color: 'from-cyan-600 to-blue-600'
  }
]

export default function PresetThemes({ onSelectPreset }) {
  const [presets, setPresets] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPreset, setSelectedPreset] = useState(null)

  useEffect(() => {
    const fetchPresets = async () => {
      try {
        const response = await fetch('/api/subtitles/presets')
        if (!response.ok) throw new Error('Failed to fetch presets')
        const data = await response.json()
        setPresets(data.presets || {})
      } catch (err) {
        console.error('Failed to load presets:', err)
        // Use local fallback definitions
        setPresets(PRESET_DEFINITIONS.reduce((acc, p) => {
          acc[p.id] = { name: p.name, style: {} }
          return acc
        }, {}))
      } finally {
        setLoading(false)
      }
    }

    fetchPresets()
  }, [])

  const handlePresetSelect = (presetId) => {
    const presetData = presets[presetId]
    if (presetData?.style) {
      setSelectedPreset(presetId)
      onSelectPreset(presetData.style)
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-6 text-center">
        <p className="text-gray-400">Loading presets...</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <h3 className="text-lg font-bold text-gray-100">Popular Presets</h3>

      <div className="grid grid-cols-2 gap-3">
        {PRESET_DEFINITIONS.map((preset, idx) => (
          <motion.button
            key={preset.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => handlePresetSelect(preset.id)}
            className={`relative p-4 rounded-xl border-2 transition-all overflow-hidden group ${
              selectedPreset === preset.id
                ? 'border-blue-500 bg-blue-600/20 shadow-lg shadow-blue-600/20'
                : 'border-gray-600/50 bg-gray-800/30 hover:border-gray-500/70 hover:bg-gray-800/50'
            }`}
          >
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${preset.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

            {/* Content */}
            <div className="relative text-left">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{preset.icon}</span>
                    <h4 className="font-bold text-gray-100">{preset.name}</h4>
                  </div>
                </div>
                {selectedPreset === preset.id && (
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                )}
              </div>
              <p className="text-xs text-gray-400 leading-tight">{preset.description}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {selectedPreset && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg"
        >
          <p className="text-sm text-blue-300">
            ✓ Preset applied! Adjust individual settings below to customize further.
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
