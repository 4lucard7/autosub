import api from './axios'

const API_BASE = '/subtitles'

// Get all available preset styles
export const getPresetStyles = async () => {
  const response = await api.get(`${API_BASE}/presets`)
  return response.data
}

// Get a specific preset style
export const getPresetStyle = async (presetName) => {
  const response = await api.get(`${API_BASE}/presets/${presetName}`)
  return response.data
}

// Save a custom subtitle style
export const saveSubtitleStyle = async (style) => {
  const response = await api.post(`${API_BASE}/styles`, style)
  return response.data
}

// Get a saved style by ID
export const getSubtitleStyle = async (styleId) => {
  const response = await api.get(`${API_BASE}/styles/${styleId}`)
  return response.data
}

// Generate a preview ASS file for live visualization
export const renderPreview = async (segments, style, jobId) => {
  const response = await api.post(`${API_BASE}/preview/render`, {
    segments,
    style,
    job_id: jobId
  })
  return response.data
}

// Apply a style to a job (regenerates ASS and optionally burns)
export const applyStyleToJob = async (jobId, style) => {
  const response = await api.post(`${API_BASE}/apply-style/${jobId}`, style)
  return response.data
}

// Get the current style for a job
export const getJobStyle = async (jobId) => {
  const response = await api.get(`${API_BASE}/job/${jobId}/style`)
  return response.data
}
