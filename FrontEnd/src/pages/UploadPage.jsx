import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { uploadVideo } from '../api/videos.api'
import { createJob } from '../api/jobs.api'
import { getUser } from '../api/auth.utils'

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

/* ── Helpers ── */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

/* ── Small file icon ── */
function FileIcon() {
  return (
    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
      <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82V15.18a1 1 0 01-1.447.89L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════ */
/*  Upload Page                                                           */
/* ════════════════════════════════════════════════════════════════════════ */
export default function UploadPage() {
  const navigate = useNavigate()
  const [files, setFiles] = useState([])
  const [sourceLanguage, setSourceLanguage] = useState('Auto Detect (Recommended)')
  const [targetLanguage, setTargetLanguage] = useState('French')
  const [burnSubtitles, setBurnSubtitles] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [jobId, setJobId] = useState(null)

  const handleStartProcessing = async () => {
    if (files.length === 0) return
    setIsProcessing(true)
    setError('')
    try {
      const user = getUser()
      const userId = user?.sub || user?.id || user?.email || 'unknown'

      // Step 1: Upload the first selected video file
      const uploadResult = await uploadVideo(files[0].file, userId)
      // Backend returns: { message, video: { video_path, ... } }
      const videoPath = uploadResult.video?.video_path || uploadResult.file_path || uploadResult.path

      // Step 2: Create a processing job with the returned path
      const jobResult = await createJob(videoPath, userId)
      setJobId(jobResult.job_id)

      // Step 3: Go to processing page to watch progress
      setTimeout(() => navigate(`/processing/${jobResult.job_id}`), 1500)
    } catch (err) {
      const detail = err.response?.data?.detail
      // Pydantic 422 errors come as an array of objects — stringify them
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

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      {/* ── Sidebar ── */}
      <Sidebar active="upload" />

      {/* ── Main column ── */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar title="New Project" />

        {/* ── Scrollable content ── */}
        <main className="flex-1 overflow-y-auto px-10 py-8">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-[28px] font-bold text-gray-900 leading-tight">
              Create your next Subtitled<br />Video
            </h1>
            <p className="text-[13px] text-gray-400 mt-2.5 max-w-sm mx-auto leading-relaxed">
              Upload your footage once — let our AI detect,
              translate, and burn subtitles in seconds.
            </p>
          </div>

          {/* ── Drop zone ── */}
          <div
            {...getRootProps()}
            className={`
              relative border-2 border-dashed rounded-2xl
              flex flex-col items-center justify-center py-14 px-8 mb-6
              transition-all duration-200 cursor-default
              ${isDragActive
                ? 'border-gray-400 bg-gray-50'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/40'
              }
            `}
          >
            <input {...getInputProps()} />

            {/* Upload icon */}
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>

            <p className="text-[14px] font-semibold text-gray-700 mb-1">
              Drag and drop your video here
            </p>
            <p className="text-[12px] text-gray-400 mb-5">
              Supports MP4, MOV, and more · or URL
            </p>

            <button
              type="button"
              onClick={open}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-[13px] font-medium rounded-lg hover:bg-gray-800 active:scale-[0.97] transition-all duration-150"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Browse File
            </button>
          </div>

          {/* ── Two-column layout ── */}
          <div className="flex gap-6">

            {/* ── Left: Selected Files ── */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[13px] font-semibold text-gray-800">
                  Selected Files
                  {files.length > 0 && (
                    <span className="ml-2 text-[12px] font-normal text-gray-400">
                      ({files.length})
                    </span>
                  )}
                </h2>
                {files.length > 0 && (
                  <button
                    onClick={() => setFiles([])}
                    className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Remove all
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {files.length === 0 ? (
                  /* Empty state */
                  <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-gray-200 rounded-xl">
                    <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82V15.18a1 1 0 01-1.447.89L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-[12px] text-gray-400">No files selected yet</p>
                  </div>
                ) : (
                  files.map(({ file, id }) => (
                    <div
                      key={id}
                      className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-100 rounded-xl hover:border-gray-200 transition-colors group"
                    >
                      <FileIcon />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-gray-800 truncate">{file.name}</p>
                        <p className="text-[11px] text-gray-400">{formatBytes(file.size)}</p>
                      </div>
                      <button
                        onClick={() => removeFile(id)}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-gray-300 hover:text-gray-500 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* ── Right: Project Settings ── */}
            <div className="w-[280px] flex-shrink-0">
              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <h2 className="text-[13px] font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Project Settings
                </h2>

                {/* Source Language */}
                <div className="mb-4">
                  <label className="block text-[11px] font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
                    Source Language
                  </label>
                  <div className="relative">
                    <select
                      value={sourceLanguage}
                      onChange={e => setSourceLanguage(e.target.value)}
                      className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-700 pr-8 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent cursor-pointer"
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

                {/* Target Language */}
                <div className="mb-4">
                  <label className="block text-[11px] font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
                    Target Language
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <select
                        value={targetLanguage}
                        onChange={e => setTargetLanguage(e.target.value)}
                        className="w-full appearance-none bg-gray-900 text-white border border-gray-800 rounded-lg px-3 py-2.5 text-[13px] pr-8 focus:outline-none focus:ring-2 focus:ring-gray-600 cursor-pointer"
                      >
                        {TARGET_LANGUAGES.map(lang => (
                          <option key={lang} value={lang} className="bg-gray-900">{lang}</option>
                        ))}
                      </select>
                      <svg className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <button className="px-3 py-2.5 text-[12px] font-medium text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap">
                      + Add
                    </button>
                  </div>
                </div>

                {/* Burn Subtitles */}
                <div className="mb-5 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={burnSubtitles}
                      onChange={e => setBurnSubtitles(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-400 cursor-pointer"
                    />
                    <div>
                      <p className="text-[12px] font-medium text-gray-700 leading-tight">Burn subtitles into video</p>
                      <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                        Permanently embed subtitles into your video file. This
                        cannot be undone after processing.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Error message */}
                {error && (
                  <div className="mb-3 px-3 py-2 bg-red-50 border border-red-100 rounded-lg text-[12px] text-red-500">
                    {error}
                  </div>
                )}

                {/* Success message */}
                {jobId && (
                  <div className="mb-3 px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-lg text-[12px] text-emerald-600">
                    ✓ Job started! Redirecting to dashboard…
                  </div>
                )}

                {/* Start Processing */}
                <button
                  onClick={handleStartProcessing}
                  disabled={files.length === 0 || isProcessing}
                  className="
                    w-full py-3 rounded-xl text-[13px] font-semibold text-white
                    bg-gradient-to-b from-gray-700 to-gray-900
                    hover:from-gray-600 hover:to-gray-800
                    disabled:opacity-40 disabled:cursor-not-allowed
                    active:scale-[0.98] transition-all duration-150
                    shadow-lg shadow-gray-900/20
                    flex items-center justify-center gap-2
                  "
                >
                  {isProcessing ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Uploading…
                    </>
                  ) : 'Start Processing'}
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* ── Footer ── */}
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