import api from './axios';

// Create a new background video processing job
export const createJob = async (videoPath, userId, burnSubtitles = false, sourceLang = 'auto', targetLang = 'fr', subtitleStyle = null) => {
  // The data matches the `JobCreate` pydantic schema in your Python backend
  const response = await api.post('/jobs/', { 
    video_path: videoPath, 
    user_id: userId,
    burn_subtitles: burnSubtitles,
    source_lang: sourceLang,
    target_lang: targetLang,
    subtitle_style: subtitleStyle
  });
  return response.data; 
};

// Get the current status of a specific job (e.g. "pending", "processing", "completed")
export const getJobStatus = async (jobId) => {
  const response = await api.get(`/jobs/${jobId}`);
  return response.data;
};

// List all jobs belonging to a specific user
export const getUserJobs = async (userId) => {
  // Using query parameters as expected by `def get_user_jobs(user_id: str):`
  const response = await api.get(`/jobs/?user_id=${userId}`);
  return response.data;
};

// Delete a specific job
export const deleteJob = async (jobId) => {
  const response = await api.delete(`/jobs/${jobId}`);
  return response.data;
};
