import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { getUser, logout } from '../api/auth.utils'

export default function SettingsPage() {
  const navigate = useNavigate()
  const user = getUser()
  const email = user?.email || ''
  const initials = email.charAt(0).toUpperCase() || 'U'

  const [activeTab, setActiveTab] = useState('profile')
  const [displayName, setDisplayName] = useState('')
  const [saved, setSaved] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    // In future: call API to update user profile
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'account', label: 'Account' },
    { id: 'notifications', label: 'Notifications' },
  ]

  return (
    <div className="flex h-screen bg-gray-50/30 font-sans overflow-hidden">
      <Sidebar active="settings" />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar title="Settings" />
        <main className="flex-1 overflow-y-auto px-10 py-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-[22px] font-bold text-gray-900 mb-1">Settings</h1>
            <p className="text-[14px] text-gray-500 mb-8">Manage your account and preferences.</p>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-gray-100 mb-8">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-[13px] font-medium rounded-t-lg transition-all -mb-px border-b-2 ${
                    activeTab === tab.id
                      ? 'text-gray-900 border-gray-900'
                      : 'text-gray-400 border-transparent hover:text-gray-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Avatar */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h2 className="text-[14px] font-semibold text-gray-800 mb-4">Profile Picture</h2>
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-2xl font-bold">
                      {initials}
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-gray-700">{email}</p>
                      <p className="text-[12px] text-gray-400 mt-0.5">Avatar based on your initial</p>
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
                  <h2 className="text-[14px] font-semibold text-gray-800 mb-2">Personal Info</h2>

                  <div>
                    <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Display Name</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[13px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full px-4 py-2.5 border border-gray-100 rounded-xl text-[13px] text-gray-400 bg-gray-50 cursor-not-allowed"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">Email cannot be changed.</p>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-gray-900 text-white text-[13px] font-medium rounded-lg hover:bg-gray-800 transition-all"
                    >
                      {saved ? '✓ Saved!' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h2 className="text-[14px] font-semibold text-gray-800 mb-1">Change Password</h2>
                  <p className="text-[13px] text-gray-400 mb-4">Update your account password.</p>
                  <div className="space-y-3">
                    <input type="password" placeholder="Current password" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all" />
                    <input type="password" placeholder="New password" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all" />
                    <button className="px-5 py-2 bg-gray-900 text-white text-[13px] font-medium rounded-lg hover:bg-gray-800 transition-all">
                      Update Password
                    </button>
                  </div>
                </div>

                {/* Danger zone */}
                <div className="bg-white rounded-2xl border border-red-100 p-6 shadow-sm">
                  <h2 className="text-[14px] font-semibold text-red-600 mb-1">Danger Zone</h2>
                  <p className="text-[13px] text-gray-400 mb-4">These actions are permanent and cannot be undone.</p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 border border-gray-200 text-gray-600 text-[13px] font-medium rounded-lg hover:bg-gray-50 transition-all"
                    >
                      Log out
                    </button>
                    <button className="px-4 py-2 border border-red-200 text-red-500 text-[13px] font-medium rounded-lg hover:bg-red-50 transition-all">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
                <h2 className="text-[14px] font-semibold text-gray-800 mb-2">Notification Preferences</h2>
                {[
                  { label: 'Job completed', desc: 'Get notified when your video is done processing.' },
                  { label: 'Job failed', desc: 'Get notified when a processing job fails.' },
                  { label: 'Weekly summary', desc: 'Receive a weekly summary of your activity.' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start justify-between py-3 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-[13px] font-medium text-gray-700">{item.label}</p>
                      <p className="text-[12px] text-gray-400 mt-0.5">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-4 mt-0.5 flex-shrink-0">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-9 h-5 bg-gray-200 peer-checked:bg-gray-900 rounded-full transition-colors peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:w-4 after:h-4 after:transition-transform" />
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
