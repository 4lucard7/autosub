import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getJobStatus } from '../api/jobs.api'
import Sidebar from '../components/Sidebar'

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
        {status === 'failed' && <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center"><svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></div>}
      </div>
      <div>
        <h3 className={`text-[14px] font-semibold leading-tight ${status === 'pending' ? 'text-gray-400' : status === 'failed' ? 'text-red-600' : 'text-gray-900'}`}>{title}</h3>
        <p className={`text-[12px] mt-0.5 leading-relaxed ${status === 'pending' ? 'text-gray-300' : status === 'failed' ? 'text-red-500' : 'text-gray-500'}`}>{description}</p>
      </div>
    </div>
  )
}

export default function ProcessingPage() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  
  const [job, setJob] = useState(null)
  const [progress, setProgress] = useState(0)
  const [logsOpen, setLogsOpen] = useState(true)

  useEffect(() => {
    let intervalId;

    const checkStatus = async () => {
      try {
        const currentJob = await getJobStatus(jobId)
        setJob(currentJob)

        if (currentJob.status === 'completed') {
          setProgress(100)
          clearInterval(intervalId)
          // Redirect to styling studio to customize subtitles before export
          setTimeout(() => navigate(`/studio/${jobId}`), 1500)
        } else if (currentJob.status === 'failed') {
          setProgress(0)
          clearInterval(intervalId)
        } else if (currentJob.status === 'processing') {
          setProgress(p => p < 90 ? p + 5 : p) // Fake progress for processing
        }
      } catch (err) {
        console.error("Failed to check job status", err)
      }
    }

    // Initial check
    checkStatus()

    // Poll every 3 seconds
    intervalId = setInterval(checkStatus, 3000)

    return () => clearInterval(intervalId)
  }, [jobId, navigate])

  const getStepStatus = (step) => {
    if (!job) return 'pending'
    if (job.status === 'failed') return 'failed'
    if (job.status === 'completed') return 'done'
    
    if (step === 'upload') return 'done'
    if (step === 'transcription') {
      return job.status === 'processing' ? 'active' : 'pending'
    }
    if (step === 'translation') {
      // Since translation and subtitles are fast after transcription, we group them into the processing state visually
      return job.status === 'processing' && progress > 50 ? 'active' : 'pending'
    }
    return 'pending'
  }

  const isFailed = job?.status === 'failed'

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      <Sidebar active="dashboard" />
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="h-[56px] flex-shrink-0 border-b border-gray-100 flex items-center px-6 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center"><svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z" /></svg></div>
            <span className="text-[15px] font-bold text-gray-900">AutoSub</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-10 py-8">
          <div className="flex gap-12">
            <div className="flex-1 max-w-xl">
              <div className="mb-5">
                <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-white text-[11px] font-medium rounded-full ${isFailed ? 'bg-red-600' : 'bg-gray-900'}`}>
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.09 6.26L20.5 9l-5 4.26L16.82 20 12 16.27 7.18 20l1.32-6.74L3.5 9l6.41-.74z" /></svg>
                  {isFailed ? 'Engine Error' : 'AI Engine Active'}
                </span>
              </div>
              <h1 className="text-[36px] font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-3">
                {isFailed ? 'Processing Failed' : 'Analyzing Your Content...'}
              </h1>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-10 max-w-md">
                {isFailed 
                  ? 'There was an issue processing your video. Please review the logs.' 
                  : 'Our advanced neural networks are transcribing your video with high precision.'}
              </p>

              <div className="space-y-7 mb-10">
                <StepItem status={getStepStatus('upload')} title="Uploading Video" description="Securely transferred to our processing cloud." />
                <StepItem status={getStepStatus('transcription')} title="AI Transcription" description="Identifying speakers and converting audio to text timestamps." />
                <StepItem status={getStepStatus('translation')} title="Neural Translation & Subtitles" description="Translating content and generating subtitles." />
              </div>

              <div className="flex items-center gap-6">
                <Link to="/dashboard" className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-red-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  Cancel & Go Back
                </Link>
                {!isFailed && (
                  <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-xl">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <div>
                      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Status</div>
                      <div className="text-[14px] font-bold text-gray-800 capitalize">{job?.status || 'Starting...'}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="w-[340px] flex-shrink-0 space-y-5">
              <div className="flex flex-col items-center">
                <div className="relative w-36 h-36 mb-3">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className={`w-24 h-24 rounded-full bg-gradient-to-br flex items-center justify-center shadow-lg ${isFailed ? 'from-red-800 to-red-900' : 'from-gray-800 to-gray-900'}`}>
                      <svg className={`w-10 h-10 ${isFailed ? 'text-red-300' : 'text-purple-300'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.09 6.26L20.5 9l-5 4.26L16.82 20 12 16.27 7.18 20l1.32-6.74L3.5 9l6.41-.74z" /></svg>
                    </div>
                  </div>
                  {!isFailed && <div className="absolute top-2 right-8 w-3 h-3 bg-gray-800 rounded-full animate-pulse" />}
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-100 rounded-full">
                  <div className={`w-2 h-2 rounded-full ${isFailed ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
                  <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
                    {isFailed ? 'Error' : 'AI Synced'}
                  </span>
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
                    <div className="bg-[#0d1117] px-4 py-3 max-h-64 overflow-y-auto border-t border-gray-800 shadow-inner">
                      {/* Terminal Header dots */}
                      <div className="flex gap-1.5 mb-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                      </div>
                      
                      <div className="space-y-1 font-mono">
                        <div className="text-[11px] leading-relaxed flex flex-nowrap gap-2 items-start">
                           <span className="text-gray-500 flex-shrink-0">[*]</span>
                           <span className="font-bold flex-shrink-0 text-[#58a6ff] w-[40px]">INFO</span>
                           <span className="text-[#c9d1d9] break-all">Job ID: <span className="text-[#d2a8ff]">{jobId}</span></span>
                        </div>
                        <div className="text-[11px] leading-relaxed flex flex-nowrap gap-2 items-start">
                           <span className="text-gray-500 flex-shrink-0">[*]</span>
                           <span className="font-bold flex-shrink-0 text-[#58a6ff] w-[40px]">INFO</span>
                           <span className="text-[#c9d1d9]">Status: <span className={job?.status === 'failed' ? 'text-[#f85149]' : 'text-[#7ee787]'}>{job?.status || 'starting...'}</span></span>
                        </div>
                        
                        {job?.error_message && (
                          <div className="mt-2 pt-2 border-t border-gray-800/50">
                            <div className="text-[11px] leading-relaxed flex flex-nowrap gap-2 items-start">
                               <span className="text-gray-500 flex-shrink-0">[*]</span>
                               <span className="font-bold flex-shrink-0 text-[#f85149] w-[40px]">ERROR</span>
                               <span className="text-[#f85149] font-medium break-words">{job.error_message}</span>
                            </div>
                            <div className="text-[10px] mt-1 pl-[56px] text-gray-500 italic">
                               Traceback: Engine exited with code 1
                            </div>
                          </div>
                        )}
                        
                        {job?.transcribed_segments && job.transcribed_segments.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-gray-800/50 space-y-1">
                            {job.transcribed_segments.slice(-5).map((seg, idx) => (
                              <div key={idx} className="text-[10px] leading-relaxed flex flex-nowrap gap-2 items-start">
                                 <span className="text-gray-600 flex-shrink-0">[{seg.start.toFixed(1)}s]</span>
                                 <span className="text-purple-300 italic">"{seg.text.trim()}"</span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {job?.status === 'processing' && (
                          <div className="text-[11px] leading-relaxed flex flex-nowrap gap-2 items-start animate-pulse mt-2">
                             <span className="text-gray-500 flex-shrink-0">[*]</span>
                             <span className="font-bold flex-shrink-0 text-[#d2a8ff] w-[40px]">BUSY</span>
                             <span className="text-[#8b949e]">Neural engine analyzing audio streams...</span>
                          </div>
                        )}
                        
                        <div className="text-[11px] mt-2 text-[#8b949e] border-t border-gray-800/30 pt-2 flex items-center gap-2">
                           <span className="w-1 h-3 bg-[#58a6ff] animate-pulse" />
                           <span>bash — autosub-cli v1.0.4</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
