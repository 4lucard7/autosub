import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'

export default function DashboardPage() {
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
                <div className="text-[32px] font-bold text-gray-900">24</div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <span className="text-[13px] font-medium text-gray-500">Processing Time</span>
                </div>
                <div className="text-[32px] font-bold text-gray-900">1h 45m</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                  </div>
                  <span className="text-[13px] font-medium text-gray-500">Storage Used</span>
                </div>
                <div className="flex items-end gap-2">
                  <div className="text-[32px] font-bold text-gray-900">7.2 <span className="text-[16px] text-gray-500 font-medium">GB</span></div>
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
                    {[
                      { name: 'Marketing_Campaign_Q3.mp4', date: 'Oct 24, 2024', status: 'Completed', type: 'video' },
                      { name: 'Interview_Raw_Footage.mov', date: 'Oct 22, 2024', status: 'Processing', type: 'video' },
                      { name: 'Product_Demo_Final.mp4', date: 'Oct 15, 2024', status: 'Completed', type: 'video' },
                    ].map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82V15.18a1 1 0 01-1.447.89L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            </div>
                            <span className="text-[14px] font-medium text-gray-800">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[13px] text-gray-500">{item.date}</td>
                        <td className="px-6 py-4">
                          {item.status === 'Completed' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 text-[12px] font-medium">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                              Ready
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-50 text-purple-600 text-[12px] font-medium">
                              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></div>
                              Processing
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-[13px] font-medium text-gray-400 hover:text-gray-900 transition-colors opacity-0 group-hover:opacity-100">
                            View details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
