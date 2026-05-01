import { Link } from 'react-router-dom'

export default function TopBar({ title = 'New Project', breadcrumb }) {
  return (
    <header className="h-[52px] flex-shrink-0 border-b border-gray-100 flex items-center px-6 gap-3 bg-white">
      {/* Small brand mark */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-gray-900 rounded flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z" />
          </svg>
        </div>
        <span className="text-[13px] font-semibold text-gray-800">AutoSub</span>
      </div>

      {/* Separator */}
      <span className="text-gray-300 text-sm select-none">/</span>

      {/* Breadcrumb */}
      {breadcrumb && (
        <>
          <Link to="/" className="text-[13px] text-gray-400 hover:text-gray-600 transition-colors">
            {breadcrumb}
          </Link>
          <span className="text-gray-300 text-sm select-none">/</span>
        </>
      )}

      <span className="text-[13px] font-medium text-gray-700">{title}</span>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-3">
        <button className="text-[13px] font-medium text-gray-500 hover:text-gray-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50">
          New Project
        </button>
        <button className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-xs font-semibold hover:ring-2 hover:ring-gray-300 transition-all">
          U
        </button>
      </div>
    </header>
  )
}