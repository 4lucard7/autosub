import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'

export default function ExportPage() {
  const [exportFormat, setExportFormat] = useState('srt')
  const [includeTimestamps, setIncludeTimestamps] = useState(true)
  const [addBom, setAddBom] = useState(false)

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      <Sidebar active="export" />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Customized TopBar to match the design (showing breadcrumb) */}
        <TopBar title="Export Subtitles" breadcrumb="Dashboard" />

        <main className="flex-1 overflow-y-auto px-10 py-8">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-10">
              <h1 className="text-[28px] font-bold text-gray-900">Finalize & Export</h1>
              <p className="text-[14px] text-gray-500 mt-1.5">
                Choose your preferred format and language to download your refined subtitles.
              </p>
            </div>

            <div className="flex gap-12">
              {/* Left Column - Form */}
              <div className="flex-1 max-w-xl">
                {/* Step 1 */}
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-[11px] font-bold text-gray-500 tracking-wider">STEP 1</span>
                  </div>
                  <h2 className="text-[20px] font-bold text-gray-900 mb-1">Select Export Format</h2>
                  <p className="text-[13px] text-gray-500 mb-5">Different platforms require specific subtitle file types.</p>

                  <div className="space-y-3">
                    {/* SRT */}
                    <div
                      onClick={() => setExportFormat('srt')}
                      className={`cursor-pointer border-2 rounded-xl p-4 flex items-start gap-4 transition-all ${exportFormat === 'srt' ? 'border-gray-900 bg-gray-50' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${exportFormat === 'srt' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <h3 className="text-[15px] font-semibold text-gray-900">SubRip</h3>
                          <span className="text-[11px] font-bold bg-gray-900 text-white px-2 py-0.5 rounded-md">.srt</span>
                        </div>
                        <p className="text-[13px] text-gray-500">Most common format, widely supported by players and social media.</p>
                      </div>
                    </div>

                    {/* VTT */}
                    <div
                      onClick={() => setExportFormat('vtt')}
                      className={`cursor-pointer border-2 rounded-xl p-4 flex items-start gap-4 transition-all ${exportFormat === 'vtt' ? 'border-gray-900 bg-gray-50' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${exportFormat === 'vtt' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <h3 className="text-[15px] font-semibold text-gray-900">WebVTT</h3>
                          <span className="text-[11px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">.vtt</span>
                        </div>
                        <p className="text-[13px] text-gray-500">Standard format for web-based video players (HTML5).</p>
                      </div>
                    </div>

                    {/* TXT */}
                    <div
                      onClick={() => setExportFormat('txt')}
                      className={`cursor-pointer border-2 rounded-xl p-4 flex items-start gap-4 transition-all ${exportFormat === 'txt' ? 'border-gray-900 bg-gray-50' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${exportFormat === 'txt' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}>
                        <span className="text-[18px] font-serif font-bold">T</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <h3 className="text-[15px] font-semibold text-gray-900">Plain Text</h3>
                          <span className="text-[11px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">.txt</span>
                        </div>
                        <p className="text-[13px] text-gray-500">Simple text file without timestamps, great for transcripts.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <span className="text-[11px] font-bold text-gray-500 tracking-wider">STEP 2</span>
                  </div>
                  <h2 className="text-[20px] font-bold text-gray-900 mb-4">Refine Settings</h2>

                  <div className="mb-5">
                    <label className="block text-[13px] font-semibold text-gray-700 mb-2">Export Language</label>
                    <div className="relative">
                      <select className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 text-[14px] text-gray-900 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer">
                        <option>English (Original)</option>
                        <option>French (Translated)</option>
                        <option>Spanish (Translated)</option>
                      </select>
                      <svg className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 text-emerald-600">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span className="text-[11px] font-medium">Verified for accuracy by AutoSub AI</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${includeTimestamps ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100 hover:border-gray-200'}`}>
                      <input
                        type="checkbox"
                        checked={includeTimestamps}
                        onChange={(e) => setIncludeTimestamps(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                      <div>
                        <div className="text-[13px] font-semibold text-gray-900 mb-0.5">Include Timestamps</div>
                        <div className="text-[11px] text-gray-500 leading-tight">Required for video synchronization.</div>
                      </div>
                    </label>

                    <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${addBom ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100 hover:border-gray-200'}`}>
                      <input
                        type="checkbox"
                        checked={addBom}
                        onChange={(e) => setAddBom(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                      <div>
                        <div className="text-[13px] font-semibold text-gray-900 mb-0.5">Add UTF-8 BOM</div>
                        <div className="text-[11px] text-gray-500 leading-tight">Helpful for legacy Windows text editors.</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column - Summary & Preview */}
              <div className="w-[380px] flex-shrink-0 space-y-6">
                {/* Project Summary */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82V15.18a1 1 0 01-1.447.89L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    <h3 className="text-[15px] font-bold text-gray-900">Project Summary</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
                      <span className="text-[13px] text-gray-500">File Name</span>
                      <span className="text-[13px] font-semibold text-gray-900">Product_Demo_Q4_Final.mp4</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
                      <span className="text-[13px] text-gray-500">Video Length</span>
                      <span className="text-[13px] font-semibold text-gray-900 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        04:22
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] text-gray-500">Total Segments</span>
                      <span className="text-[13px] font-semibold text-gray-900">148 Lines</span>
                    </div>
                  </div>
                </div>

                {/* File Preview */}
                <div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-1">File Preview</h3>
                  <p className="text-[12px] text-gray-500 mb-3">First few lines of your .{exportFormat} file</p>
                  
                  <div className="bg-[#0B1120] rounded-xl p-5 relative overflow-hidden">
                    <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {exportFormat.toUpperCase()} Preview
                    </div>
                    <pre className="text-[12px] text-gray-300 font-mono leading-relaxed whitespace-pre-wrap">
                      <span className="text-gray-500">1</span><br />
                      <span className="text-blue-300">00:00:01,000</span> <span className="text-gray-500">{"-->"}</span> <span className="text-blue-300">00:00:04,500</span><br />
                      <span className="text-gray-100">Welcome to the official<br />AutoSub product walkthrough.</span><br />
                      <br />
                      <span className="text-gray-500">2</span><br />
                      <span className="text-blue-300">00:00:04,500</span> <span className="text-gray-500">{"-->"}</span> <span className="text-blue-300">00:00:08,200</span><br />
                      <span className="text-gray-100">In this video, we'll show you<br />how to export your files.</span>
                    </pre>
                  </div>
                </div>

                {/* Download Button */}
                <div className="pt-2">
                  <button className="w-full flex items-center justify-center gap-2.5 bg-gray-900 text-white font-semibold text-[14px] py-4 rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all shadow-xl shadow-gray-900/10 mb-3">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Download .{exportFormat} File
                  </button>
                  <p className="text-[11px] text-gray-400 text-center px-4 leading-relaxed">
                    Your subtitles will download directly to your default browser folder.
                  </p>
                </div>

                {/* YouTube Tip */}
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex gap-3 mt-6">
                  <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <div>
                    <h4 className="text-[13px] font-semibold text-yellow-800 mb-0.5">Uploading to YouTube?</h4>
                    <p className="text-[11px] text-yellow-700/80 leading-relaxed">
                      We recommend using the <strong>.SRT</strong> format for the best compatibility with YouTube's CC system.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </main>
        
        <footer className="px-8 py-5 border-t border-gray-100 flex items-center justify-center gap-6 flex-shrink-0">
          <span className="text-[11px] text-gray-400">© 2024 AutoSub AI</span>
          <a href="#" className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors">Privacy Policy</a>
          <a href="#" className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors">Terms of Service</a>
          <a href="#" className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors">Support</a>
        </footer>
      </div>
    </div>
  )
}
