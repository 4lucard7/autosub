import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { getJobStatus } from '../api/jobs.api'

const API_BASE_URL = import.meta.env.VITE_API_URL || ''

function resolveBackendUrl(path) {
  if (!path) return null
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  if (path.startsWith('/')) return `${API_BASE_URL}${path}`
  return `${API_BASE_URL}/${path}`
}

function getExportFileUrl(job, format) {
  if (!job) return null
  if (format === 'txt') return resolveBackendUrl(job.txt_path)
  if (format === 'video') return job.burned_video_path ? resolveBackendUrl(job.burned_video_path) : null
  return resolveBackendUrl(job.srt_path)
}

async function convertSrtToVtt(srtText) {
  const lines = srtText.split(/\r?\n/)
  const result = ['WEBVTT', '']
  for (const line of lines) {
    const timestampMatch = line.match(/^(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})$/)
    if (timestampMatch) {
      result.push(`${timestampMatch[1].replace(/,/g, '.')} --> ${timestampMatch[2].replace(/,/g, '.')}`)
    } else {
      result.push(line)
    }
  }
  return result.join('\n')
}

export default function ExportPage() {
  const { jobId } = useParams()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [exportFormat, setExportFormat] = useState('srt')
  const [addBom, setAddBom] = useState(false)

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) {
        setLoading(false)
        return
      }
      try {
        const data = await getJobStatus(jobId)
        setJob(data)
        if (data.status !== 'completed') navigate(`/processing/${jobId}`)
      } catch (err) {
        console.error('Failed to load job', err)
      } finally {
        setLoading(false)
      }
    }
    fetchJob()
  }, [jobId, navigate])

  const fileName = job?.video_path ? job.video_path.split(/[\\/]/).pop() : 'export'
  const exportUrl = getExportFileUrl(job, exportFormat)
  const extensionMap = { srt: 'srt', vtt: 'vtt', txt: 'txt', video: job?.burned_video_path ? job.burned_video_path.split('.').pop() : 'mp4' }
  const downloadName = `${fileName.replace(/\.[^/.]+$/, '') || 'export'}.${extensionMap[exportFormat] || 'txt'}`
  const isDownloadReady = !!exportUrl && job?.status === 'completed'

  if (loading) return <div className="flex h-screen items-center justify-center">Loading job details…</div>

  if (!jobId) {
    return (
      <div className="flex h-screen bg-white font-sans overflow-hidden">
        <Sidebar active="export" />
        <div className="flex flex-col flex-1 overflow-hidden">
          <TopBar title="Export Subtitles" breadcrumb="Dashboard" />
          <main className="flex-1 overflow-y-auto px-10 py-8">
            <div className="max-w-3xl mx-auto rounded-3xl border border-gray-100 bg-white p-10 shadow-sm text-center">
              <h1 className="text-2xl font-bold mb-4">Export requires a job</h1>
              <p className="text-sm text-gray-500">
                Select a completed job from the dashboard or files page first. Then return here to download subtitles or a burned video.
              </p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  const handleDownload = async () => {
    if (!isDownloadReady || !job) return
    const sourceUrl = exportFormat === 'vtt' ? getExportFileUrl(job, 'srt') : exportUrl
    const useBlobDownload = exportFormat === 'vtt' || addBom
    if (!sourceUrl) return

    if (useBlobDownload) {
      try {
        const response = await fetch(sourceUrl)
        if (!response.ok) throw new Error('Failed to fetch subtitle source')
        let content = await response.text()
        if (exportFormat === 'vtt') content = await convertSrtToVtt(content)
        if (addBom) content = `\uFEFF${content}`
        const blobType = exportFormat === 'vtt' ? 'text/vtt;charset=utf-8' : 'text/plain;charset=utf-8'
        const blob = new Blob([content], { type: blobType })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = downloadName
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
      } catch (err) {
        console.error('Download failed', err)
      }
      return
    }

    const a = document.createElement('a')
    a.href = exportUrl
    a.download = downloadName
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      <Sidebar active="export" />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar title="Export Subtitles" breadcrumb="Dashboard" />
        <main className="flex-1 overflow-y-auto px-10 py-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Finalize & Export</h1>

            <div className="flex gap-8">
              <div className="flex-1">
                <div className="space-y-3">
                  <button onClick={() => setExportFormat('srt')} className={`px-4 py-2 rounded ${exportFormat === 'srt' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>Download .srt</button>
                  <button onClick={() => setExportFormat('vtt')} className={`px-4 py-2 rounded ${exportFormat === 'vtt' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>Download .vtt</button>
                  <button onClick={() => setExportFormat('txt')} className={`px-4 py-2 rounded ${exportFormat === 'txt' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>Download .txt</button>
                  <button onClick={() => setExportFormat('video')} className={`px-4 py-2 rounded ${exportFormat === 'video' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>Download video</button>
                </div>

                <div className="mt-6">
                  <label className="inline-flex items-center">
                    <input type="checkbox" checked={addBom} onChange={(e) => setAddBom(e.target.checked)} />
                    <span className="ml-2">Add UTF-8 BOM (for .txt)</span>
                  </label>
                </div>

                <div className="mt-6">
                  <button onClick={handleDownload} disabled={!isDownloadReady} className="px-6 py-3 bg-blue-600 text-white rounded disabled:opacity-50">Download</button>
                </div>
              </div>

              <div className="w-80">
                <div className="p-4 bg-gray-50 rounded">Job ID: {jobId}</div>
                <div className="mt-4 p-4 bg-gray-50 rounded">Status: {job?.status}</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
