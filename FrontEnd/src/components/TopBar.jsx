import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function TopBar({ title = 'New Project', breadcrumb }) {
  return (
    <header className="h-[52px] flex-shrink-0 border-b border-gray-100 flex items-center px-6 gap-3 bg-white">
      {/* Small brand mark */}
      <Link to="/">
        <Logo boxSize={20} iconSize={12} className="opacity-90" />
      </Link>

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