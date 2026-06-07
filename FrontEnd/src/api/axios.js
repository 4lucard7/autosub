import axios from "axios";
import { logout } from "./auth.utils";

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

// auto logout on 401 (invalid/expired token or DB unreachable)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;