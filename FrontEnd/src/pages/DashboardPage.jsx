import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { getUserJobs, deleteJob } from '../api/jobs.api'
import { getUser } from '../api/auth.utils'

export default function DashboardPage() {
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

  const handleJobClick = (job) => {
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
      <Sidebar active="dashboard" />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar title="Dashboard" />
        
        <main className="flex-1 overflow-y-auto px-10 py-8">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-[24px] font-bold text-gray-900">Welcome back</h1>
                <p className="text-[14px] text-gray-500 mt-1">Here's an overview of your recent projects.</p>
              </div>
              <Link to="/upload" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-[13px] font-medium rounded-lg hover:bg-gray-800 transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                New Project
              </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82V15.18a1 1 0 01-1.447.89L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  </div>
                  <span className="text-[13px] font-medium text-gray-500">Total Videos</span>
                </div>
                <div className="text-[32px] font-bold text-gray-900">{jobs.length}</div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <span className="text-[13px] font-medium text-gray-500">Completed Projects</span>
                </div>
                <div className="text-[32px] font-bold text-gray-900">
                  {jobs.filter(j => j.status === 'completed').length}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <span className="text-[13px] font-medium text-gray-500">Processing</span>
                </div>
                <div className="flex items-end gap-2">
                  <div className="text-[32px] font-bold text-gray-900">
                    {jobs.filter(j => j.status === 'processing' || j.status === 'pending').length}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Files */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[16px] font-semibold text-gray-900">Recent Projects</h2>
                <Link to="/files" className="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors">
                  View all
                </Link>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                {loading ? (
                  <div className="py-12 text-center text-[13px] text-gray-500">Loading your projects...</div>
                ) : jobs.length === 0 ? (
                  <div className="py-12 text-center text-[13px] text-gray-500">No projects yet. Click New Project to get started!</div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="px-6 py-4 text-[12px] font-medium text-gray-500">Name</th>
                        <th className="px-6 py-4 text-[12px] font-medium text-gray-500">Date</th>
                        <th className="px-6 py-4 text-[12px] font-medium text-gray-500">Status</th>
                        <th className="px-6 py-4 text-[12px] font-medium text-gray-500 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {jobs.map((job) => {
                        const dateStr = new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        // Extract filename from the path
                        const fileName = job.video_path ? job.video_path.split(/[\\/]/).pop() : 'Unknown Video'
                        
                        return (
                          <tr key={job.job_id} onClick={() => handleJobClick(job)} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82V15.18a1 1 0 01-1.447.89L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                </div>
                                <span className="text-[14px] font-medium text-gray-800 truncate max-w-[250px]" title={fileName}>{fileName}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-[13px] text-gray-500">{dateStr}</td>
                            <td className="px-6 py-4">
                              {job.status === 'completed' ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 text-[12px] font-medium">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                  Ready
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
                                <span className="text-[13px] font-medium text-gray-400 group-hover:text-gray-900 transition-colors">
                                  View
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
          </div>
        </main>
      </div>
    </div>
  )
}
