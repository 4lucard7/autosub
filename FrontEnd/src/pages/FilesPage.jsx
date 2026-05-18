import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { getUserJobs, deleteJob } from '../api/jobs.api'
import { getUser } from '../api/auth.utils'

export default function FilesPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchJobs = async () => {
    try {
      const user = getUser()
      const userId = user?.sub || user?.id || user?.email || 'unknown'
      const data = await getUserJobs(userId)
      // Sort newest first
      const sortedJobs = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      setJobs(sortedJobs)
    } catch (err) {
      console.error("Failed to load jobs", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const handleRowClick = (job) => {
    if (job.status === 'completed') {
      navigate(`/export/${job.job_id}`)
    } else {
      navigate(`/processing/${job.job_id}`)
    }
  }

  const handleDelete = async (e, jobId) => {
    e.stopPropagation(); // Prevent row click
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteJob(jobId);
        // Refresh the jobs list
        fetchJobs();
      } catch (err) {
        console.error("Failed to delete job", err);
        alert("Failed to delete job");
      }
    }
  }

  return (
    <div className="flex h-screen bg-gray-50/30 font-sans overflow-hidden">
      <Sidebar active="files" />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar title="My Files" />
        <main className="flex-1 overflow-y-auto px-10 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-[24px] font-bold text-gray-900">All Projects</h1>
                <p className="text-[14px] text-gray-500 mt-1">Manage and export all your processed videos.</p>
              </div>
              <button onClick={() => navigate('/upload')} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-[13px] font-medium rounded-lg hover:bg-gray-800 transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                New Upload
              </button>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              {loading ? (
                <div className="py-16 text-center text-[13px] text-gray-500">Loading your files...</div>
              ) : jobs.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                    </svg>
                  </div>
                  <h3 className="text-[16px] font-semibold text-gray-900 mb-1">No projects yet</h3>
                  <p className="text-[13px] text-gray-500 mb-6">Upload a video to get started with automatic subtitles.</p>
                  <button onClick={() => navigate('/upload')} className="px-5 py-2 bg-white border border-gray-200 text-gray-700 text-[13px] font-medium rounded-lg hover:bg-gray-50 transition-all shadow-sm">
                    Upload Video
                  </button>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="px-6 py-4 text-[12px] font-medium text-gray-500">File Name</th>
                      <th className="px-6 py-4 text-[12px] font-medium text-gray-500">Date Added</th>
                      <th className="px-6 py-4 text-[12px] font-medium text-gray-500">Target Language</th>
                      <th className="px-6 py-4 text-[12px] font-medium text-gray-500">Status</th>
                      <th className="px-6 py-4 text-[12px] font-medium text-gray-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {jobs.map((job) => {
                      const dateStr = new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      const fileName = job.video_path ? job.video_path.split(/[\\/]/).pop() : 'Unknown Video'
                      
                      return (
                        <tr key={job.job_id} onClick={() => handleRowClick(job)} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82V15.18a1 1 0 01-1.447.89L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                              </div>
                              <span className="text-[14px] font-medium text-gray-800 truncate max-w-[300px]" title={fileName}>{fileName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[13px] text-gray-500">{dateStr}</td>
                          <td className="px-6 py-4 text-[13px] text-gray-500">{job.target_lang || 'Original'}</td>
                          <td className="px-6 py-4">
                            {job.status === 'completed' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 text-[12px] font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                Completed
                              </span>
                            ) : job.status === 'failed' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 text-red-600 text-[12px] font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                Failed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-50 text-purple-600 text-[12px] font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></div>
                                Processing
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <span className="text-[13px] font-medium text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                {job.status === 'completed' ? 'Export' : 'View'}
                              </span>
                              <button 
                                onClick={(e) => handleDelete(e, job.job_id)}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                                title="Delete Project"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
