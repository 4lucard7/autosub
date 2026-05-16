import { Link, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import { getUser, logout } from '../api/auth.utils'

export default function TopBar({ title = 'New Project', breadcrumb }) {
  const navigate = useNavigate()
  const user = getUser()
  const email = user?.email || ''
  const initials = email.charAt(0).toUpperCase() || 'U'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="h-[52px] flex-shrink-0 border-b border-gray-100 flex items-center px-6 gap-3 bg-white">
      <Link to="/">
        <Logo boxSize={20} iconSize={12} className="opacity-90" />
      </Link>
      <span className="text-gray-300 text-sm select-none">/</span>
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
        <Link
          to="/upload"
          className="text-[13px] font-medium text-gray-500 hover:text-gray-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50"
        >
          New Project
        </Link>
        <div className="relative group">
          <button className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-xs font-semibold hover:ring-2 hover:ring-gray-300 transition-all">
            {initials}
          </button>
          {/* Dropdown */}
          <div className="absolute right-0 top-10 w-44 bg-white border border-gray-100 rounded-xl shadow-lg py-1 hidden group-hover:block z-50">
            <Link to="/settings" className="flex items-center gap-2 px-4 py-2 text-[13px] text-gray-600 hover:bg-gray-50">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-[13px] text-red-500 hover:bg-red-50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}