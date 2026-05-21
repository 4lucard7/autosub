import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { getJobStatus } from '../api/jobs.api'
import SubtitleStylePanel from '../components/SubtitleStudio/SubtitleStylePanel'
import SubtitlePreview from '../components/SubtitleStudio/SubtitlePreview'
import PresetThemes from '../components/SubtitleStudio/PresetThemes'

const API_BASE_URL = import.meta.env.VITE_API_URL || ''

const DEFAULT_STYLE = {
  font_name: 'Arial',
  font_size: 48,
  text_color: 'FFFFFF',
  bold: false,
  italic: false,
  alignment: 2,
  margin_l: 0,
  margin_r: 0,
  margin_v: 30,
  outline_width: 2,
  outline_color: '000000',
  shadow_depth: 0,
  shadow_color: '000000',
  background_color: '000000',
  background_opacity: 0,
  letter_spacing: 0,
  line_spacing: 0,
  preset: 'custom'
}

export default function SubtitleStylingStudio() {
  const { jobId } = useParams()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [subtitleStyle, setSubtitleStyle] = useState(DEFAULT_STYLE)
  const [previewText, setPreviewText] = useState('Here is how your subtitles will look!')
  const [showPresetPanel, setShowPresetPanel] = useState(false)
  const [applying, setApplying] = useState(false)

  // Fetch job and existing style
  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) return
      try {
        const data = await getJobStatus(jobId)
        setJob(data)
        
        // Load existing style if available
        if (data.subtitle_style) {
          setSubtitleStyle({ ...DEFAULT_STYLE, ...data.subtitle_style })
        }
      } catch (err) {
        console.error('Failed to load job', err)
      } finally {
        setLoading(false)
      }
    }
    fetchJob()
  }, [jobId])

  // Handle style updates
  const handleStyleUpdate = useCallback((updates) => {
    setSubtitleStyle(prev => ({ ...prev, ...updates }))
  }, [])

  // Handle preset selection
  const handleApplyPreset = useCallback((presetStyle) => {
    setSubtitleStyle({ ...DEFAULT_STYLE, ...presetStyle })
    setShowPresetPanel(false)
  }, [])

  // Save style and apply to job
  const handleApplyStyle = async () => {
    if (!jobId) return
    
    setApplying(true)
    try {
      const response = await fetch(`${API_BASE_URL}/subtitles/apply-style/${jobId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subtitleStyle)
      })

      if (!response.ok) throw new Error('Failed to apply style')

      const result = await response.json()
      
      // Show success feedback and redirect
      setTimeout(() => {
        navigate(`/export/${jobId}`)
      }, 1000)
    } catch (err) {
      console.error('Error applying style:', err)
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-white font-sans">
        <Sidebar active="studio" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading styling studio...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 font-sans overflow-hidden">
      <Sidebar active="studio" />

      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar title="Subtitle Styling Studio" breadcrumb="Dashboard" />

        <main className="flex-1 overflow-hidden flex gap-6 px-8 py-6">
          {/* Left: Style Controls */}
          <div className="flex-1 flex flex-col gap-6 overflow-y-auto">
            {/* Preset Themes Button */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowPresetPanel(!showPresetPanel)}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg active:scale-95"
              >
                {showPresetPanel ? '✕ Close Presets' : '✨ Browse Presets'}
              </button>
            </div>

            {/* Presets Panel */}
            {showPresetPanel && (
              <PresetThemes onSelectPreset={handleApplyPreset} />
            )}

            {/* Style Control Panel */}
            <SubtitleStylePanel
              style={subtitleStyle}
              onStyleChange={handleStyleUpdate}
            />
          </div>

          {/* Right: Live Preview */}
          <div className="w-[500px] flex flex-col gap-4">
            <SubtitlePreview
              style={subtitleStyle}
              previewText={previewText}
              videoPath={job?.video_path}
            />

            {/* Apply Button */}
            <button
              onClick={handleApplyStyle}
              disabled={applying}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-lg rounded-xl hover:from-emerald-700 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg active:scale-95"
            >
              {applying ? 'Applying...' : '🔥 Apply & Burn Subtitles'}
            </button>

            {/* Info Text */}
            <p className="text-xs text-gray-400 text-center">
              Changes are previewed in real-time. Click "Apply" to finalize and burn into your video.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
