import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

/* ── Sidebar (Processing variant with purple accents) ── */
function ProcessingSidebar() {
  const items = [
    { id: 'dashboard', label: 'Dashboard', to: '/dashboard', active: true, icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )},
    { id: 'editor', label: 'Editor', to: '/editor', icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
      </svg>
    )},
    { id: 'upload', label: 'New Upload', to: '/upload', accent: true, icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    )},
    { id: 'export', label: 'Export', to: '/export', icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    )},
  ]

  return (
    <aside className="w-[200px] flex-shrink-0 border-r border-gray-100 flex flex-col bg-white h-full">
      <nav className="flex-1 px-3 py-6 space-y-1">
        {items.map((item) => (
          <Link key={item.id} to={item.to}
            className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all
              ${item.active ? 'text-purple-600 bg-purple-50/60' : item.accent ? 'text-purple-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}>
            {(item.active || item.accent) && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-purple-500 rounded-r-full" />}
            <span className={item.active || item.accent ? 'text-purple-500' : 'text-gray-400'}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="px-3 pb-3 space-y-1">
        <Link to="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-gray-500 hover:bg-gray-50 transition-all">
          <svg className="w-[18px] h-[18px] text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><circle cx="12" cy="12" r="3" /></svg>
          Settings
        </Link>
        <Link to="/team" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-gray-500 hover:bg-gray-50 transition-all">
          <svg className="w-[18px] h-[18px] text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          Team
        </Link>
      </div>
      <div className="px-5 py-4 border-t border-gray-100">
        <div className="text-[11px] font-medium text-gray-400 mb-2">Storage</div>
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-1.5">
          <div className="h-full w-[72%] bg-gradient-to-r from-purple-500 to-purple-400 rounded-full" />
        </div>
        <div className="text-[10px] text-gray-400">7.2 GB of 10 GB used</div>
      </div>
    </aside>
  )
}

function ProgressRing({ progress = 42 }) {
  const r = 48, s = 5, nr = r - s, c = nr * 2 * Math.PI, off = c - (progress / 100) * c
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={r * 2} height={r * 2} className="-rotate-90">
        <circle stroke="#f3f4f6" fill="transparent" strokeWidth={s} r={nr} cx={r} cy={r} />
        <circle stroke="#8b5cf6" fill="transparent" strokeWidth={s} strokeLinecap="round" strokeDasharray={c + ' ' + c} style={{ strokeDashoffset: off }} r={nr} cx={r} cy={r} className="transition-all duration-1000 ease-out" />
      </svg>
      <span className="absolute text-[20px] font-bold text-gray-900">{progress}%</span>
    </div>
  )
}

function StepItem({ status, title, description }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 mt-0.5">
        {status === 'done' && <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center"><svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>}
        {status === 'active' && <div className="w-7 h-7 rounded-full border-2 border-purple-400 flex items-center justify-center animate-spin" style={{ animationDuration: '2s' }}><div className="w-2 h-2 bg-purple-500 rounded-full" /></div>}
        {status === 'pending' && <div className="w-7 h-7 rounded-full border-2 border-gray-200 flex items-center justify-center"><div className="w-2 h-2 bg-gray-300 rounded-full" /></div>}
      </div>
      <div>
        <h3 className={`text-[14px] font-semibold leading-tight ${status === 'pending' ? 'text-gray-400' : 'text-gray-900'}`}>{title}</h3>
        <p className={`text-[12px] mt-0.5 leading-relaxed ${status === 'pending' ? 'text-gray-300' : 'text-gray-500'}`}>{description}</p>
      </div>
    </div>
  )
}

const LOGS = [
  { time: '14:02:11', type: 'SUCCESS', msg: 'Establishing secure handshake with API-v4...' },
  { time: '14:02:12', type: 'INFO', msg: 'Input stream verified: 1080p H.264' },
  { time: '14:02:15', type: 'INFO', msg: 'Preprocessing audio buffers for noise reduction' },
  { time: '14:02:18', type: 'SUCCESS', msg: 'Speaker 1 detected: confidence 0.98' },
  { time: '14:02:22', type: 'INFO', msg: 'Splitting long duration segments (ID: 0x4f)' },
  { time: '14:02:25', type: 'INFO', msg: 'Language detected: English (US)' },
  { time: '14:02:30', type: 'INFO', msg: 'Running deep phonetic analysis...' },
]

export default function ProcessingPage() {
  const [progress, setProgress] = useState(42)
  const [logsOpen, setLogsOpen] = useState(true)

  useEffect(() => {
    const iv = setInterval(() => setProgress(p => p < 95 ? p + 1 : p), 3000)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      <ProcessingSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="h-[56px] flex-shrink-0 border-b border-gray-100 flex items-center px-6 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center"><svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z" /></svg></div>
            <span className="text-[15px] font-bold text-gray-900">AutoSub</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button className="text-[13px] font-medium text-purple-600 border border-purple-200 px-4 py-1.5 rounded-lg hover:bg-purple-50 transition-colors">Upgrade</button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-xs font-semibold ring-2 ring-purple-100">U</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-10 py-8">
          <div className="flex gap-12">
            <div className="flex-1 max-w-xl">
              <div className="mb-5">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gray-900 text-white text-[11px] font-medium rounded-full">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.09 6.26L20.5 9l-5 4.26L16.82 20 12 16.27 7.18 20l1.32-6.74L3.5 9l6.41-.74z" /></svg>
                  AI Engine Active
                </span>
              </div>
              <h1 className="text-[36px] font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-3">Analyzing Your Content...</h1>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-10 max-w-md">Our advanced neural networks are transcribing your video with 99.8% precision.</p>

              <div className="space-y-7 mb-10">
                <StepItem status="done" title="Uploading Video" description="Securely transferred 142.5MB to our processing cloud." />
                <StepItem status="active" title="AI Transcription" description="Identifying speakers and converting audio to text timestamps." />
                <StepItem status="pending" title="Neural Translation" description="Translating content into 12 selected target languages." />
                <StepItem status="pending" title="Generating Subtitles" description="Optimizing readability and formatting export blocks." />
              </div>

              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-red-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  Cancel Process
                </button>
                <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-xl">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <div>
                    <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Est. Remaining</div>
                    <div className="text-[14px] font-bold text-gray-800">~ 2m 45s</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-[340px] flex-shrink-0 space-y-5">
              <div className="flex flex-col items-center">
                <div className="relative w-36 h-36 mb-3">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-lg">
                      <svg className="w-10 h-10 text-purple-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.09 6.26L20.5 9l-5 4.26L16.82 20 12 16.27 7.18 20l1.32-6.74L3.5 9l6.41-.74z" /></svg>
                    </div>
                  </div>
                  <div className="absolute top-2 right-8 w-3 h-3 bg-gray-800 rounded-full animate-pulse" />
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-100 rounded-full">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">AI Synced</span>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[14px] font-semibold text-gray-900">Task Pipeline</h3>
                  <ProgressRing progress={progress} />
                </div>
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <button onClick={() => setLogsOpen(!logsOpen)} className="w-full flex items-center justify-between px-4 py-3 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Technical Progress Logs
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${logsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {logsOpen && (
                    <div className="bg-gray-50 px-4 py-3 max-h-52 overflow-y-auto border-t border-gray-100">
                      <div className="space-y-1.5 font-mono">
                        {LOGS.map((log, i) => (
                          <div key={i} className="text-[11px] leading-relaxed flex gap-2">
                            <span className="text-gray-400 flex-shrink-0">[{log.time}]</span>
                            <span className={`font-semibold flex-shrink-0 ${log.type === 'SUCCESS' ? 'text-emerald-600' : 'text-gray-400'}`}>{log.type}</span>
                            <span className="text-gray-600">{log.msg}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                <h4 className="text-[13px] font-semibold text-gray-800 mb-1">Pro Tip</h4>
                <p className="text-[12px] text-gray-500 leading-relaxed">You can close this window. Processing continues in the cloud and we'll notify you when it's ready.</p>
              </div>
            </div>
          </div>
        </main>

        <footer className="px-8 py-4 border-t border-gray-100 flex items-center justify-between flex-shrink-0">
          <span className="text-[11px] text-gray-400">© 2024 AutoSub AI. All rights reserved.</span>
          <div className="flex items-center gap-5 text-[11px] text-gray-400">
            <a href="#" className="hover:text-gray-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Terms</a>
            <span>Status: <span className="text-emerald-600 font-medium">Operational</span></span>
          </div>
        </footer>
      </div>
    </div>
  )
}
