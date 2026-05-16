import api from './axios';

// Upload a video file to the server
export const uploadVideo = async (file, userId) => {
  // We must use FormData because we are sending an actual file, not just JSON!
  const formData = new FormData();
  formData.append('file', file);
  formData.append('user_id', userId);

  // Axios will automatically set the correct boundaries for multipart/form-data
  const response = await api.post('/videos/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Get metadata for a specific uploaded video
export const getVideo = async (videoId) => {
  const response = await api.get(`/videos/${videoId}`);
  return response.data;
};

// Get all videos uploaded by a user
export const getUserVideos = async (userId) => {
  const response = await api.get(`/videos/user/${userId}`);
  return response.data;
};
