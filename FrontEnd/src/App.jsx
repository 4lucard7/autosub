import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import UploadPage from './pages/UploadPage'
import ProcessingPage from './pages/ProcessingPage'
import DashboardPage from './pages/DashboardPage'
import ExportPage from './pages/ExportPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/processing" element={<ProcessingPage />} />
        <Route path="/export" element={<ExportPage />} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}