import { Link, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { isLoggedIn, getUser, logout } from '../api/auth.utils'

/* ── Navbar ── */
function Navbar() {
  const loggedIn = isLoggedIn()
  const user = getUser()
  const email = user?.email || ''
  const initials = email.charAt(0).toUpperCase() || 'U'
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    // Force re-render since we're already on / 
    window.location.reload()
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <Logo />
        </Link>

        {/* Center links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors">Product</a>
          <a href="#workflow" className="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors">Features</a>
          <a href="#cta" className="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors">Pricing</a>
          <a href="#footer" className="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors">Contact</a>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {loggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors px-1"
              >
                Dashboard
              </Link>
              
              <div className="relative group">
                <Link
                  to="/settings"
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-xs font-semibold hover:ring-2 hover:ring-gray-300 transition-all"
                >
                  {initials}
                </Link>
                
                {/* Hover Profile Details */}
                <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="p-4 border-b border-gray-50">
                    <div className="text-[13px] font-bold text-gray-900 truncate mb-0.5">{email}</div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-600 text-[9px] font-bold uppercase tracking-wider">Free Plan</span>
                      <span className="text-[10px] text-gray-400">2.4 / 5 GB used</span>
                    </div>
                    <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full w-[48%] bg-gray-800 rounded-full" />
                    </div>
                  </div>
                  <div className="p-2 space-y-0.5">
                    <Link to="/settings" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><circle cx="12" cy="12" r="3" /></svg>
                      Account Settings
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all text-left">
                      <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/login"
                className="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors px-3 py-1.5"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="text-[13px] font-semibold text-white bg-gray-900 hover:bg-gray-800 px-4 py-2 rounded-lg transition-all active:scale-[0.97]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

/* ── Hero Section ── */
function Hero() {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-b from-white to-gray-50/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Text */}
          <div className="flex-1 text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-1.5 py-1.5 bg-white border border-gray-100 rounded-full shadow-sm mb-8">
              <span className="px-2.5 py-0.5 bg-gray-100 text-[11px] font-semibold text-gray-800 rounded-full uppercase tracking-wide">New</span>
              <span className="text-[12px] font-medium text-gray-500 pr-3">Initial version is now live powered by FastWhisper</span>
            </div>

            {/* Heading */}
            <h1 className="text-[52px] md:text-[64px] font-extrabold text-gray-900 leading-[1.05] tracking-tight mb-6">
              Generate Subtitles<br />
              Instantly <span className="text-gray-300">with AI</span>
            </h1>

            {/* Subtitle */}
            <p className="text-[16px] text-gray-500 leading-relaxed max-w-lg mb-10">
              Upload your video and watch as our neural engines transcribe, translate, and sync subtitles in seconds. Perfect for creators who value speed and precision.
            </p>

            {/* Actions */}
            <div className="flex items-center gap-4 mb-8">
              <Link
                to="/upload"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-700 text-white text-[15px] font-semibold rounded-xl hover:from-gray-800 hover:to-gray-600 active:scale-[0.98] transition-all shadow-xl shadow-gray-900/20"
              >
                Upload Video
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <button className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 text-[15px] font-semibold rounded-xl hover:bg-gray-50 active:scale-[0.98] transition-all border border-gray-100 shadow-sm">
                Watch Demo
              </button>
            </div>

            {/* Features */}
            <div className="flex items-center gap-6 text-[13px] font-medium text-gray-500">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                No card required
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                10 free minutes
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                HD Support
              </div>
            </div>
          </div>

          {/* Right Image/Mockup */}
          <div className="flex-1 relative w-full flex justify-end">
            <div className="relative w-full max-w-[500px]">
              {/* Main video mock */}
              <div className="w-full aspect-[4/3] bg-[#2A2A2A] rounded-2xl shadow-2xl overflow-hidden relative border border-gray-800">
                <img src="https://images.unsplash.com/photo-1600607688969-a5bfcd64bd2b?q=80&w=800&auto=format&fit=crop" alt="Video preview" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                {/* Subtitle block */}
                <div className="absolute bottom-12 left-6 right-6">
                  <div className="bg-black/60 backdrop-blur-md rounded-xl p-4 border border-white/10">
                    <p className="text-white text-[16px] font-medium leading-snug">
                      "AutoSub helps us automate 90% of our subtitle workflow."
                    </p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3">
                  <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-[45%] bg-white rounded-full"></div>
                  </div>
                  <span className="text-white text-[11px] font-medium">AI Transcribing...</span>
                </div>
                <svg className="absolute top-4 right-4 w-5 h-5 text-white/50" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.09 6.26L20.5 9l-5 4.26L16.82 20 12 16.27 7.18 20l1.32-6.74L3.5 9l6.41-.74z" /></svg>
              </div>

              {/* Floating card */}
              <div className="absolute -bottom-6 -left-12 bg-white rounded-2xl shadow-2xl p-5 border border-gray-100 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div>
                  <div className="text-[11px] font-medium text-gray-400 mb-0.5">Processing Time</div>
                  <div className="text-[16px] font-bold text-gray-900">Under 12s</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Features Section ── */
function Features() {
  const features = [
    {
      title: 'AI Transcription',
      desc: 'Powered by state-of-the-art speech recognition. Accurate results in seconds, not hours.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m-4 0h8m-4-8a3 3 0 01-3-3V5a3 3 0 016 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
    },
    {
      title: 'Instant Translation',
      desc: 'Translate your subtitles to 50+ languages instantly. Reach a global audience with one click.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      ),
    },
    {
      title: 'Advanced Export',
      desc: 'Export as SRT, VTT, or burn subtitles directly into your video. Ready for any platform.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
    },
  ]

  return (
    <section id="features" className="py-24 bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section badge */}
        <div className="flex justify-center mb-4">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Features</span>
        </div>

        <h2 className="text-center text-[32px] font-bold text-gray-900 leading-tight">
          Everything You Need to<br />Go Global
        </h2>
        <p className="text-center text-[14px] text-gray-500 mt-3 max-w-md mx-auto leading-relaxed">
          A full suite of tools to transcribe, translate, and burn subtitles into your content.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white border border-gray-100 rounded-2xl p-7 hover:border-gray-200 hover:shadow-sm transition-all group"
            >
              <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 mb-5 group-hover:bg-gray-900 group-hover:text-white transition-all">
                {feature.icon}
              </div>
              <h3 className="text-[15px] font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-[13px] text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Workflow Section ── */
function Workflow() {
  const steps = [
    {
      num: '01',
      title: 'Upload Your Content',
      desc: 'Drag and drop your video file. We support MP4, MOV, AVI, and more.',
    },
    {
      num: '02',
      title: 'AI Does the Work',
      desc: 'Our AI transcribes and translates your content automatically.',
    },
    {
      num: '03',
      title: 'Export & Share',
      desc: 'Download subtitles or get your video with burned-in subtitles.',
    },
  ]

  return (
    <section id="workflow" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          {/* Left: Steps */}
          <div className="flex-1">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">How it works</span>
            <h2 className="text-[28px] font-bold text-gray-900 mt-3 leading-tight">
              Your Workflow,<br />Optimized.
            </h2>

            <div className="mt-10 space-y-8">
              {steps.map((step) => (
                <div key={step.num} className="flex gap-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-[12px] font-bold text-gray-500 flex-shrink-0 mt-0.5">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="text-[14px] font-semibold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-[13px] text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Preview card */}
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-md bg-gray-900 rounded-2xl overflow-hidden shadow-2xl shadow-gray-900/30">
              <div className="px-5 py-3 flex items-center gap-2 border-b border-gray-800">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
              </div>
              <div className="p-6">
                <div className="bg-gray-800 rounded-xl p-4 mb-3">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-gray-700 rounded-lg"></div>
                    <div>
                      <div className="h-2.5 w-28 bg-gray-700 rounded"></div>
                      <div className="h-2 w-16 bg-gray-700/60 rounded mt-1.5"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-gray-700 rounded"></div>
                    <div className="h-2 w-4/5 bg-gray-700 rounded"></div>
                    <div className="h-2 w-3/5 bg-gray-700 rounded"></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 flex-1 bg-blue-600 rounded-lg"></div>
                  <div className="h-8 w-20 bg-gray-800 rounded-lg border border-gray-700"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── CTA Section ── */
function CTA() {
  return (
    <section id="cta" className="py-24 bg-gray-950">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-[32px] font-bold text-white leading-tight">
          Ready to subtitle your first video?
        </h2>
        <p className="text-[14px] text-gray-400 mt-3 max-w-md mx-auto leading-relaxed">
          Join 10,000+ creators who trust AutoSub to reach global audiences.
          Your first 3 videos are free.
        </p>
        <div className="mt-8">
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-gray-900 text-[14px] font-semibold rounded-xl hover:bg-gray-100 active:scale-[0.97] transition-all"
          >
            Start for Free
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ── Footer ── */
function Footer() {
  return (
    <footer id="footer" className="py-14 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-3">
              <Logo />
            </Link>
            <p className="text-[12px] text-gray-400 leading-relaxed max-w-[200px]">
              AI-powered subtitle generation for creators worldwide.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4">Product</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">Features</a></li>
              <li><a href="#" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">Pricing</a></li>
              <li><a href="#" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">API</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4">Resources</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">Blog</a></li>
              <li><a href="#" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4">Company</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">About</a></li>
              <li><a href="#" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">Privacy</a></li>
              <li><a href="#" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">© 2026 AutoSub. All rights reserved.</span>
          <div className="flex items-center gap-4">
            {/* Twitter/X */}
            <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            {/* GitHub */}
            <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ════════════════════════════════════════════════════════════════════════ */
/*  Home Page                                                              */
/* ════════════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <Hero />
      <Features />
      <Workflow />
      <CTA />
      <Footer />
    </div>
  )
}
