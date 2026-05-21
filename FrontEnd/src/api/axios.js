import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || ''
const api = axios.create({
  baseURL,
});

// auto attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;