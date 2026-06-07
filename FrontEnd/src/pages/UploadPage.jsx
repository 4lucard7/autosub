import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { uploadVideo } from '../api/videos.api'
import { createJob } from '../api/jobs.api'
import { getUser } from '../api/auth.utils'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bold as BoldIcon, Italic as ItalicIcon, AlignLeft, AlignCenter, AlignRight, 
  Sparkles, Sliders, Palette, Layout, Type, 
  Check, Info, Layers, Eye, RefreshCw
} from 'lucide-react'

/* ── Language lists ── */
const LANGUAGES = [
  'Auto Detect (Recommended)',
  'English',
  'French',
  'Spanish',
  'Arabic',
  'German',
  'Italian',
  'Portuguese',
  'Chinese',
  'Japanese',
  'Korean',
]

const TARGET_LANGUAGES = [
  'French',
  'English',
  'Spanish',
  'Arabic',
  'German',
  'Italian',
  'Portuguese',
  'Chinese',
  'Japanese',
  'Korean',
]

const LANG_CODES = {
  'Auto Detect (Recommended)': 'auto',
  'English': 'en',
  'French': 'fr',
  'Spanish': 'es',
  'Arabic': 'ar',
  'German': 'de',
  'Italian': 'it',
  'Portuguese': 'pt',
  'Chinese': 'zh',
  'Japanese': 'ja',
  'Korean': 'ko',
}

const FONTS = [
  'Arial',
  'Trebuchet MS',
  'Impact',
  'Courier New',
  'Georgia',
  'Verdana',
  'Times New Roman'
]

const PRESETS = [
  {
    name: 'Netflix',
    description: 'Classic cinema feel',
    style: {
      font_name: 'Arial',
      font_size: 26,
      text_color: '#FFFFFF',
      bold: false,
      italic: false,
      border_style: 1,
      outline_color: '#000000',
      outline_width: 1.5,
      background_color: '#000000',
      background_opacity: 0.8,
      shadow: 2.0,
      letter_spacing: 0.5,
      alignment: 2,
      margin_v: 60
    }
  },
  {
    name: 'TikTok',
    description: 'Energetic & bold',
    style: {
      font_name: 'Impact',
      font_size: 36,
      text_color: '#FFFF00',
      bold: true,
      italic: false,
      border_style: 1,
      outline_color: '#000000',
      outline_width: 3.0,
      background_color: '#000000',
      background_opacity: 0.0,
      shadow: 0.0,
      letter_spacing: 1.0,
      alignment: 2,
      margin_v: 120
    }
  },
  {
    name: 'YouTube Shorts',
    description: 'Vibrant pop attention',
    style: {
      font_name: 'Trebuchet MS',
      font_size: 32,
      text_color: '#FFFFFF',
      bold: true,
      italic: true,
      border_style: 3, // Background box
      outline_color: '#000000',
      outline_width: 0.0,
      background_color: '#FF0000',
      background_opacity: 0.9,
      shadow: 0.0,
      letter_spacing: 0.0,
      alignment: 2,
      margin_v: 100
    }
  },
  {
    name: 'Gaming',
    description: 'Cyberpunk glow',
    style: {
      font_name: 'Trebuchet MS',
      font_size: 30,
      text_color: '#00FF00',
      bold: true,
      italic: false,
      border_style: 1,
      outline_color: '#000000',
      outline_width: 2.5,
      background_color: '#000000',
      background_opacity: 0.0,
      shadow: 3.0,
      letter_spacing: 0.5,
      alignment: 2,
      margin_v: 80
    }
  },
  {
    name: 'Cinematic',
    description: 'Traditional narrative',
    style: {
      font_name: 'Georgia',
      font_size: 24,
      text_color: '#E5E5E5',
      bold: false,
      italic: true,
      border_style: 1,
      outline_color: '#1A1A1A',
      outline_width: 1.0,
      background_color: '#000000',
      background_opacity: 0.0,
      shadow: 1.0,
      letter_spacing: 2.0,
      alignment: 2,
      margin_v: 50
    }
  },
  {
    name: 'Minimal',
    description: 'Clean & unobtrusive',
    style: {
      font_name: 'Arial',
      font_size: 22,
      text_color: '#FFFFFF',
      bold: false,
      italic: false,
      border_style: 1,
      outline_color: '#000000',
      outline_width: 1.0,
      background_color: '#000000',
      background_opacity: 0.0,
      shadow: 0.0,
      letter_spacing: 0.0,
      alignment: 2,
      margin_v: 40
    }
  },
  {
    name: 'Neon',
    description: 'Futuristic synthwave',
    style: {
      font_name: 'Courier New',
      font_size: 28,
      text_color: '#FF00FF',
      bold: true,
      italic: false,
      border_style: 1,
      outline_color: '#00FFFF',
      outline_width: 2.0,
      background_color: '#000000',
      background_opacity: 0.0,
      shadow: 4.0,
      letter_spacing: 1.5,
      alignment: 2,
      margin_v: 70
    }
  }
]

/* ── Helpers ── */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

function hexToRgba(hex, alpha) {
  if (!hex) return `rgba(0,0,0,${alpha})`
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function FileIcon() {
  return (
    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
      <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82V15.18a1 1 0 01-1.447.89L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    </div>
  )
}

export default function UploadPage() {
  const navigate = useNavigate()
  const [files, setFiles] = useState([])
  const [sourceLanguage, setSourceLanguage] = useState('Auto Detect (Recommended)')
  const [targetLanguage, setTargetLanguage] = useState('French')
  const [burnSubtitles, setBurnSubtitles] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [jobId, setJobId] = useState(null)
  
  // Premium Subtitle Studio Styling State
  const [subtitleStyle, setSubtitleStyle] = useState({
    font_name: 'Arial',
    font_size: 28,
    text_color: '#FFFFFF',
    bold: false,
    italic: false,
    alignment: 2,
    margin_v: 60,
    border_style: 1, // 1 = Outline, 3 = Background Box
    outline_color: '#000000',
    outline_width: 2.0,
    background_color: '#000000',
    background_opacity: 0.5,
    shadow: 1.0,
    letter_spacing: 0.0,
    line_spacing: 0.0
  })

  const [activeTab, setActiveTab] = useState('presets') // presets, typography, colors, layout
  const [showSafeAreas, setShowSafeAreas] = useState(true)

  const handleStartProcessing = async () => {
    if (files.length === 0) return
    setIsProcessing(true)
    setError('')
    try {
      const user = getUser()
      const userId = user?.sub || user?.id || user?.email || 'unknown'

      // Step 1: Upload the first selected video file
      const uploadResult = await uploadVideo(files[0].file, userId)
      const videoPath = uploadResult.video?.video_path || uploadResult.file_path || uploadResult.path

      // Step 2: Create a processing job with styles passed
      const sourceLangCode = LANG_CODES[sourceLanguage] || 'auto'
      const targetLangCode = LANG_CODES[targetLanguage] || 'fr'

      const jobResult = await createJob(
        videoPath, 
        userId, 
        burnSubtitles, 
        sourceLangCode,
        targetLangCode,
        burnSubtitles ? subtitleStyle : null
      )
      setJobId(jobResult.job_id)

      // Step 3: Go to processing page to watch progress
      setTimeout(() => navigate(`/processing/${jobResult.job_id}`), 1500)
    } catch (err) {
      const detail = err.response?.data?.detail
      const msg = Array.isArray(detail)
        ? detail.map(e => `${e.loc?.slice(-1)[0]}: ${e.msg}`).join(', ')
        : (typeof detail === 'string' ? detail : 'Upload failed. Please try again.')
      setError(msg)
      setIsProcessing(false)
    }
  }

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(prev => [
      ...prev,
      ...acceptedFiles.map(f => ({
        file: f,
        id: Math.random().toString(36).slice(2),
      })),
    ])
  }, [])

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm'] },
    noClick: true,
    noKeyboard: true,
  })

  const removeFile = (id) => setFiles(prev => prev.filter(f => f.id !== id))

  const applyPreset = (presetStyle) => {
    setSubtitleStyle(prev => ({
      ...prev,
      ...presetStyle
    }))
  }

  const handleStyleChange = (key, value) => {
    setSubtitleStyle(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // Visual helper styles for subtitles preview
  const previewTextStyles = {
    fontFamily: subtitleStyle.font_name === 'Impact' ? 'Impact, sans-serif' : 
                 subtitleStyle.font_name === 'Trebuchet MS' ? '"Trebuchet MS", sans-serif' :
                 subtitleStyle.font_name === 'Courier New' ? '"Courier New", monospace' :
                 subtitleStyle.font_name === 'Georgia' ? 'Georgia, serif' : 
                 subtitleStyle.font_name === 'Times New Roman' ? '"Times New Roman", serif' : 
                 subtitleStyle.font_name === 'Verdana' ? 'Verdana, sans-serif' : 'Arial, sans-serif',
    fontSize: `${subtitleStyle.font_size * 0.85}px`, // Scaled for mock window
    fontWeight: subtitleStyle.bold ? 'bold' : 'normal',
    fontStyle: subtitleStyle.italic ? 'italic' : 'normal',
    color: subtitleStyle.text_color,
    letterSpacing: `${subtitleStyle.letter_spacing}px`,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    textAlign: subtitleStyle.alignment === 1 ? 'left' : subtitleStyle.alignment === 3 ? 'right' : 'center',
    
    // Conditional styles for Outline vs Background box
    ...(subtitleStyle.border_style === 1 ? {
      WebkitTextStroke: `${subtitleStyle.outline_width}px ${subtitleStyle.outline_color}`,
      textShadow: `${subtitleStyle.shadow}px ${subtitleStyle.shadow}px 0px ${subtitleStyle.outline_color}`
    } : {
      backgroundColor: hexToRgba(subtitleStyle.background_color, subtitleStyle.background_opacity),
      padding: '6px 16px',
      borderRadius: '8px',
      WebkitTextStroke: '0px transparent',
      textShadow: 'none'
    })
  }

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      <Sidebar active="upload" />

      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar title="New Project" />

        <main className="flex-1 overflow-y-auto px-10 py-8 bg-[#FAFBFD]">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-[32px] font-extrabold text-gray-900 leading-tight tracking-tight">
              Create Stunning Subtitled Videos
            </h1>
            <p className="text-[14px] text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">
              Upload footage, customize cinematic subtitles, and let AutoSub AI render your next viral clip.
            </p>
          </div>

          {/* Drop zone */}
          <div
            {...getRootProps()}
            className={`
              relative border-2 border-dashed rounded-2xl
              flex flex-col items-center justify-center py-12 px-8 mb-6
              transition-all duration-200 cursor-default
              ${isDragActive
                ? 'border-indigo-400 bg-indigo-50/25 shadow-inner'
                : 'border-gray-250 bg-white hover:border-indigo-350 hover:bg-gray-50/30'
              }
            `}
          >
            <input {...getInputProps()} />

            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3.5 shadow-sm">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>

            <p className="text-[14px] font-bold text-gray-800 mb-0.5">
              Drag and drop your video file
            </p>
            <p className="text-[12px] text-gray-400 mb-4">
              Supports MP4, MOV, MKV up to 500MB
            </p>

            <button
              type="button"
              onClick={open}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white text-[13px] font-semibold rounded-xl active:scale-[0.97] transition-all duration-150 shadow-md shadow-indigo-600/10"
            >
              Browse Footage
            </button>
          </div>

          {/* Core Upload Workflow */}
          <div className="flex gap-6 items-start">
            
            {/* Left Column: Files list */}
            <div className="flex-1 min-w-0 bg-white border border-gray-150 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                <h2 className="text-[13px] font-bold text-gray-800 uppercase tracking-wider">
                  Selected Files
                </h2>
                {files.length > 0 && (
                  <button
                    onClick={() => setFiles([])}
                    className="text-[12px] text-indigo-600 hover:text-indigo-850 font-semibold transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {files.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                    <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82V15.18a1 1 0 01-1.447.89L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-[12px] text-gray-400">Please choose a video file above</p>
                  </div>
                ) : (
                  files.map(({ file, id }) => (
                    <div
                      key={id}
                      className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-100 rounded-xl hover:border-gray-200 shadow-sm transition-colors group"
                    >
                      <FileIcon />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-gray-800 truncate">{file.name}</p>
                        <p className="text-[11px] text-gray-400">{formatBytes(file.size)}</p>
                      </div>
                      <button
                        onClick={() => removeFile(id)}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-gray-350 hover:text-gray-650 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Column: Base Settings */}
            <div className="w-[320px] flex-shrink-0 bg-white border border-gray-150 rounded-2xl p-5 shadow-sm">
              <h2 className="text-[13px] font-bold text-gray-800 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-gray-400" />
                Project Config
              </h2>

              {/* Source Lang */}
              <div className="mb-4">
                <label className="block text-[11px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">
                  Source Language
                </label>
                <div className="relative">
                  <select
                    value={sourceLanguage}
                    onChange={e => setSourceLanguage(e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] text-gray-700 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 cursor-pointer transition-all"
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                  <svg className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Target Lang */}
              <div className="mb-4">
                <label className="block text-[11px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">
                  Target Language
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select
                      value={targetLanguage}
                      onChange={e => setTargetLanguage(e.target.value)}
                      className="w-full appearance-none bg-gray-900 text-white border border-gray-800 rounded-xl px-3 py-2.5 text-[13px] pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      {TARGET_LANGUAGES.map(lang => (
                        <option key={lang} value={lang} className="bg-gray-900">{lang}</option>
                      ))}
                    </select>
                    <svg className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <button className="px-3 py-2.5 text-[12px] font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors whitespace-nowrap">
                    + Add
                  </button>
                </div>
              </div>

              {/* Burn Toggle */}
              <div className="mb-5 p-3.5 bg-indigo-50/40 border border-indigo-100/50 rounded-xl">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={burnSubtitles}
                    onChange={e => setBurnSubtitles(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-400 cursor-pointer transition-all"
                  />
                  <div>
                    <p className="text-[12.5px] font-bold text-gray-800 leading-none">Burn subtitles into video</p>
                    <p className="text-[11px] text-gray-400 mt-1 leading-normal">
                      Permanently burn styled subtitles directly into the video stream. Ideal for Shorts & TikTok.
                    </p>
                  </div>
                </label>
              </div>

              {/* Start Processing */}
              {error && (
                <div className="mb-3 px-3 py-2 bg-red-50 border border-red-100 rounded-lg text-[12px] text-red-500">
                  {error}
                </div>
              )}

              {jobId && (
                <div className="mb-3 px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-lg text-[12px] text-emerald-600">
                  ✓ Job started! Redirecting…
                </div>
              )}

              <button
                onClick={handleStartProcessing}
                disabled={files.length === 0 || isProcessing}
                className="
                  w-full py-3.5 rounded-xl text-[13.5px] font-bold text-white
                  bg-gradient-to-b from-indigo-500 to-indigo-600
                  hover:from-indigo-600 hover:to-indigo-700
                  disabled:opacity-40 disabled:cursor-not-allowed
                  active:scale-[0.98] transition-all duration-150
                  shadow-lg shadow-indigo-600/20
                  flex items-center justify-center gap-2
                "
              >
                {isProcessing ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Uploading...
                  </>
                ) : 'Start Processing'}
              </button>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════════════ */}
          {/*  Subtitle Styling Studio Dashboard UI                                    */}
          {/* ════════════════════════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {burnSubtitles && (
              <motion.div
                initial={{ opacity: 0, y: 30, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: 30, height: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="overflow-hidden mt-8"
              >
                <div className="bg-slate-950 border border-slate-850 rounded-3xl p-6 md:p-8 shadow-2xl text-slate-100">
                  {/* Studio Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-850 pb-5">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                          Studio Mode
                        </span>
                        <h2 className="text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                          Subtitle Styling Studio
                        </h2>
                      </div>
                      <p className="text-[13px] text-slate-400 mt-1">
                        Craft gorgeous cinematic text formats. Perfect synchronization and high-fidelity output.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowSafeAreas(!showSafeAreas)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12px] font-medium transition-all ${
                          showSafeAreas 
                            ? 'bg-slate-800/80 border-slate-700 text-slate-200 shadow-sm' 
                            : 'bg-slate-900 border-slate-850 text-slate-400 hover:border-slate-800'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Safe Area Guide
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col xl:flex-row gap-8">
                    
                    {/* WIDESCREEN LIVE PREVIEW PANEL (Right Column) */}
                    <div className="flex-1 xl:order-2 space-y-4">
                      <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-4 flex flex-col items-center">
                        <div className="flex items-center justify-between w-full mb-3 px-2">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-indigo-400" />
                            WYSIWYG Subtitle Canvas
                          </span>
                          <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                            PlayRes: 1920x1080
                          </span>
                        </div>

                        {/* Video frame preview container */}
                        <div className="w-full aspect-video bg-[#0c101d] rounded-xl relative overflow-hidden shadow-2xl border border-slate-800/60 group">
                          {/* Simulated scenic background frame */}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-[#0E1528] to-indigo-950/20 opacity-85 z-0" />
                          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-slate-400 opacity-25 group-hover:opacity-40 transition-opacity">
                              <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            </div>
                          </div>

                          {/* Safe Area guides */}
                          {showSafeAreas && (
                            <div className="absolute inset-4 border border-dashed border-yellow-500/30 rounded-lg pointer-events-none z-10">
                              <span className="absolute top-1.5 left-2.5 text-[8.5px] font-bold text-yellow-500/50 uppercase tracking-widest font-mono">
                                Safe Border Area (TikTok / YouTube Shorts)
                              </span>
                            </div>
                          )}

                          {/* Interactive Live Subtitle Element */}
                          <div 
                            className="absolute inset-x-8 z-20 flex flex-col pointer-events-none"
                            style={{ 
                              // Position aligned by margin_v
                              bottom: `${subtitleStyle.margin_v * 0.22}px`, 
                              alignItems: subtitleStyle.alignment === 1 ? 'flex-start' : 
                                          subtitleStyle.alignment === 3 ? 'flex-end' : 'center'
                            }}
                          >
                            <span style={previewTextStyles}>
                              Here is how your subtitles will look!
                            </span>
                          </div>

                          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/5 text-[9px] font-bold text-white px-2 py-0.5 rounded uppercase tracking-wider z-20">
                            Live Render
                          </div>
                        </div>

                        {/* Quick guidance warning */}
                        <div className="flex items-start gap-2 bg-slate-950/40 border border-slate-850 rounded-xl p-3 mt-3 w-full">
                          <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                          <p className="text-[11.5px] text-slate-400 leading-normal">
                            This real-time canvas simulates the exact pixel metrics of the backend ASS layout generator. Safe borders are recommended so subtitles are never blocked by TikTok/Shorts UI elements.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* DASHBOARD CONTROLS PANEL (Left Column) */}
                    <div className="w-full xl:w-[480px] xl:order-1 flex flex-col">
                      
                      {/* Tabs navigation */}
                      <div className="flex bg-slate-900 border border-slate-850 p-1 rounded-xl mb-5">
                        <button
                          onClick={() => setActiveTab('presets')}
                          className={`flex-1 py-2 text-[12px] font-bold rounded-lg transition-all ${
                            activeTab === 'presets' 
                              ? 'bg-indigo-600 text-white shadow-md' 
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5 inline mr-1" />
                          Presets
                        </button>
                        <button
                          onClick={() => setActiveTab('typography')}
                          className={`flex-1 py-2 text-[12px] font-bold rounded-lg transition-all ${
                            activeTab === 'typography' 
                              ? 'bg-indigo-600 text-white shadow-md' 
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <Type className="w-3.5 h-3.5 inline mr-1" />
                          Font
                        </button>
                        <button
                          onClick={() => setActiveTab('colors')}
                          className={`flex-1 py-2 text-[12px] font-bold rounded-lg transition-all ${
                            activeTab === 'colors' 
                              ? 'bg-indigo-600 text-white shadow-md' 
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <Palette className="w-3.5 h-3.5 inline mr-1" />
                          Colors
                        </button>
                        <button
                          onClick={() => setActiveTab('layout')}
                          className={`flex-1 py-2 text-[12px] font-bold rounded-lg transition-all ${
                            activeTab === 'layout' 
                              ? 'bg-indigo-600 text-white shadow-md' 
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <Layout className="w-3.5 h-3.5 inline mr-1" />
                          Position
                        </button>
                      </div>

                      {/* TAB CONTENT: PRESETS */}
                      {activeTab === 'presets' && (
                        <div className="space-y-4">
                          <h3 className="text-[12px] font-bold text-slate-450 uppercase tracking-wider mb-2">
                            Select Subtitle Preset
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                            {PRESETS.map((preset) => {
                              const isSelected = PRESETS.find(p => p.name === preset.name && 
                                subtitleStyle.font_name === p.style.font_name && 
                                subtitleStyle.border_style === p.style.border_style &&
                                subtitleStyle.text_color === p.style.text_color
                              ) !== undefined;
                              
                              return (
                                <div
                                  key={preset.name}
                                  onClick={() => applyPreset(preset.style)}
                                  className={`cursor-pointer rounded-xl p-3 border-2 transition-all flex flex-col hover:scale-[1.01] ${
                                    isSelected 
                                      ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-600/5' 
                                      : 'border-slate-850 bg-slate-900/55 hover:border-slate-750'
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[13px] font-extrabold text-slate-100">{preset.name}</span>
                                    {isSelected && <span className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" /></span>}
                                  </div>
                                  <span className="text-[10px] text-slate-400 leading-snug">{preset.description}</span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* TAB CONTENT: TYPOGRAPHY */}
                      {activeTab === 'typography' && (
                        <div className="space-y-5">
                          {/* Font family */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                              Font Family
                            </label>
                            <div className="relative">
                              <select
                                value={subtitleStyle.font_name}
                                onChange={e => handleStyleChange('font_name', e.target.value)}
                                className="w-full appearance-none bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-[13px] text-slate-100 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 cursor-pointer"
                              >
                                {FONTS.map(font => (
                                  <option key={font} value={font} className="bg-slate-900">{font}</option>
                                ))}
                              </select>
                              <svg className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                          </div>

                          {/* Size slider */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                Font Size
                              </label>
                              <span className="text-[11px] font-mono text-indigo-400 font-bold">{subtitleStyle.font_size}px</span>
                            </div>
                            <input
                              type="range"
                              min="16"
                              max="72"
                              value={subtitleStyle.font_size}
                              onChange={e => handleStyleChange('font_size', parseInt(e.target.value))}
                              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                          </div>

                          {/* Bold / Italic Toggles */}
                          <div className="flex gap-4">
                            <button
                              onClick={() => handleStyleChange('bold', !subtitleStyle.bold)}
                              className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 text-[12px] font-bold transition-all ${
                                subtitleStyle.bold 
                                  ? 'bg-indigo-600 border-indigo-550 text-white shadow-md shadow-indigo-600/10' 
                                  : 'bg-slate-900 border-slate-800 text-slate-355 hover:border-slate-700'
                              }`}
                            >
                              <BoldIcon className="w-4 h-4" />
                              Bold
                            </button>
                            <button
                              onClick={() => handleStyleChange('italic', !subtitleStyle.italic)}
                              className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 text-[12px] font-bold transition-all ${
                                subtitleStyle.italic 
                                  ? 'bg-indigo-600 border-indigo-550 text-white shadow-md shadow-indigo-600/10' 
                                  : 'bg-slate-900 border-slate-800 text-slate-355 hover:border-slate-700'
                              }`}
                            >
                              <ItalicIcon className="w-4 h-4" />
                              Italic
                            </button>
                          </div>

                          {/* Letter Spacing */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                Letter Spacing
                              </label>
                              <span className="text-[11px] font-mono text-indigo-400 font-bold">{subtitleStyle.letter_spacing}px</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="10"
                              step="0.5"
                              value={subtitleStyle.letter_spacing}
                              onChange={e => handleStyleChange('letter_spacing', parseFloat(e.target.value))}
                              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                          </div>
                        </div>
                      )}

                      {/* TAB CONTENT: COLORS */}
                      {activeTab === 'colors' && (
                        <div className="space-y-5">
                          {/* Text color selection */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                              Text Color
                            </label>
                            <div className="flex items-center gap-3">
                              <input 
                                type="color" 
                                value={subtitleStyle.text_color}
                                onChange={e => handleStyleChange('text_color', e.target.value)}
                                className="w-10 h-10 rounded-lg border-2 border-slate-700 bg-transparent cursor-pointer"
                              />
                              <input 
                                type="text" 
                                value={subtitleStyle.text_color.toUpperCase()}
                                onChange={e => handleStyleChange('text_color', e.target.value)}
                                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-[12px] font-mono text-slate-100 w-[110px]"
                              />
                              
                              {/* Simple Palette Circle buttons */}
                              {['#FFFFFF', '#FFFF00', '#00FF00', '#FF00FF', '#FF3B30'].map(c => (
                                <button
                                  key={c}
                                  onClick={() => handleStyleChange('text_color', c)}
                                  className={`w-7 h-7 rounded-full border-2 transition-all ${
                                    subtitleStyle.text_color === c ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'
                                  }`}
                                  style={{ backgroundColor: c }}
                                />
                              ))}
                            </div>
                          </div>

                          <div className="border-t border-slate-850 my-4" />

                          {/* Border style choice */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                              Visual Style Mode
                            </label>
                            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
                              <button
                                onClick={() => handleStyleChange('border_style', 1)}
                                className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-all ${
                                  subtitleStyle.border_style === 1 
                                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700' 
                                    : 'text-slate-400 hover:text-slate-200'
                                }`}
                              >
                                Outline & Shadow
                              </button>
                              <button
                                onClick={() => handleStyleChange('border_style', 3)}
                                className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-all ${
                                  subtitleStyle.border_style === 3 
                                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700' 
                                    : 'text-slate-400 hover:text-slate-200'
                                }`}
                              >
                                Opaque Background Box
                              </button>
                            </div>
                          </div>

                          {/* Dynamic outline vs background customizers */}
                          {subtitleStyle.border_style === 1 ? (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                                  Outline Color
                                </label>
                                <div className="flex items-center gap-3">
                                  <input 
                                    type="color" 
                                    value={subtitleStyle.outline_color}
                                    onChange={e => handleStyleChange('outline_color', e.target.value)}
                                    className="w-8 h-8 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                                  />
                                  <input 
                                    type="text" 
                                    value={subtitleStyle.outline_color.toUpperCase()}
                                    onChange={e => handleStyleChange('outline_color', e.target.value)}
                                    className="bg-slate-900 border border-slate-850 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-slate-100 w-[95px]"
                                  />
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                    Outline Thickness
                                  </label>
                                  <span className="text-[11px] font-mono text-indigo-400 font-bold">{subtitleStyle.outline_width}px</span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="6"
                                  step="0.5"
                                  value={subtitleStyle.outline_width}
                                  onChange={e => handleStyleChange('outline_width', parseFloat(e.target.value))}
                                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                    Drop Shadow
                                  </label>
                                  <span className="text-[11px] font-mono text-indigo-400 font-bold">{subtitleStyle.shadow}px</span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="8"
                                  step="0.5"
                                  value={subtitleStyle.shadow}
                                  onChange={e => handleStyleChange('shadow', parseFloat(e.target.value))}
                                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                                  Background Color
                                </label>
                                <div className="flex items-center gap-3">
                                  <input 
                                    type="color" 
                                    value={subtitleStyle.background_color}
                                    onChange={e => handleStyleChange('background_color', e.target.value)}
                                    className="w-8 h-8 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                                  />
                                  <input 
                                    type="text" 
                                    value={subtitleStyle.background_color.toUpperCase()}
                                    onChange={e => handleStyleChange('background_color', e.target.value)}
                                    className="bg-slate-900 border border-slate-850 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-slate-100 w-[95px]"
                                  />
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                    Background Opacity
                                  </label>
                                  <span className="text-[11px] font-mono text-indigo-400 font-bold">{Math.round(subtitleStyle.background_opacity * 100)}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="1"
                                  step="0.05"
                                  value={subtitleStyle.background_opacity}
                                  onChange={e => handleStyleChange('background_opacity', parseFloat(e.target.value))}
                                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* TAB CONTENT: LAYOUT & POSITIONING */}
                      {activeTab === 'layout' && (
                        <div className="space-y-5">
                          {/* Alignment selector */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                              Horizontal Alignment
                            </label>
                            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
                              <button
                                onClick={() => handleStyleChange('alignment', 1)}
                                className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-1.5 text-[12px] font-bold transition-all ${
                                  subtitleStyle.alignment === 1 
                                    ? 'bg-slate-800 text-white border border-slate-700 shadow-sm' 
                                    : 'text-slate-450 hover:text-slate-200'
                                }`}
                              >
                                <AlignLeft className="w-3.5 h-3.5" />
                                Left
                              </button>
                              <button
                                onClick={() => handleStyleChange('alignment', 2)}
                                className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-1.5 text-[12px] font-bold transition-all ${
                                  subtitleStyle.alignment === 2 
                                    ? 'bg-slate-800 text-white border border-slate-700 shadow-sm' 
                                    : 'text-slate-450 hover:text-slate-200'
                                }`}
                              >
                                <AlignCenter className="w-3.5 h-3.5" />
                                Center
                              </button>
                              <button
                                onClick={() => handleStyleChange('alignment', 3)}
                                className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-1.5 text-[12px] font-bold transition-all ${
                                  subtitleStyle.alignment === 3 
                                    ? 'bg-slate-800 text-white border border-slate-700 shadow-sm' 
                                    : 'text-slate-450 hover:text-slate-200'
                                }`}
                              >
                                <AlignRight className="w-3.5 h-3.5" />
                                Right
                              </button>
                            </div>
                          </div>

                          {/* Vertical position MarginV slider */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                Vertical Margin (MarginV)
                              </label>
                              <span className="text-[11px] font-mono text-indigo-400 font-bold">{subtitleStyle.margin_v}px</span>
                            </div>
                            <input
                              type="range"
                              min="20"
                              max="280"
                              value={subtitleStyle.margin_v}
                              onChange={e => handleStyleChange('margin_v', parseInt(e.target.value))}
                              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                            <p className="text-[10px] text-slate-500 mt-1 leading-normal font-sans">
                              Higher values shift the subtitles vertically upwards on the video canvas, keeping safe-zones clear.
                            </p>
                          </div>
                        </div>
                      )}

                    </div>

                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </main>

        <footer className="px-8 py-4 border-t border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-center gap-6 text-[11px] text-gray-400">
            <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Cookie Policy</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Contact</a>
          </div>
        </footer>
      </div>
    </div>
  )
}