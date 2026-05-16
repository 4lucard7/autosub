import api from './axios';

// Login user and get JWT token
export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data; // Expected: { success: true, access_token: "...", token_type: "bearer" }
};

// Register a new user
export const registerUser = async (email, password) => {
  const response = await api.post('/auth/register', { email, password });
  return response.data; // Expected: { success: true, message: "User registered successfully" }
};

// Logout (if you want to hit the backend, otherwise just localStorage.removeItem('token'))
export const logoutUser = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};
