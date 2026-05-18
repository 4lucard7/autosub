import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import UploadPage from './pages/UploadPage'
import ProcessingPage from './pages/ProcessingPage'
import DashboardPage from './pages/DashboardPage'
import ExportPage from './pages/ExportPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import FilesPage from './pages/FilesPage'
import SettingsPage from './pages/SettingsPage'
import { isLoggedIn } from './api/auth.utils'

// Protect routes that require login
function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />
}

// Redirect logged-in users away from public pages
function PublicRoute({ children }) {
  return isLoggedIn() ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public — landing page can be viewed by anyone */}
        <Route path="/" element={<HomePage />} />
        
        {/* Auth — redirect to dashboard if already logged in */}
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

        {/* Protected */}
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/upload"    element={<PrivateRoute><UploadPage /></PrivateRoute>} />
        <Route path="/processing/:jobId" element={<PrivateRoute><ProcessingPage /></PrivateRoute>} />
        <Route path="/export/:jobId"    element={<PrivateRoute><ExportPage /></PrivateRoute>} />
        <Route path="/files"     element={<PrivateRoute><FilesPage /></PrivateRoute>} />
        <Route path="/settings"  element={<PrivateRoute><SettingsPage /></PrivateRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}