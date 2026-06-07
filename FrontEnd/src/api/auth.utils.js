/**
 * Authentication utilities for AutoSub frontend
 */

/**
 * Decodes a JWT token and returns the payload.
 * @param {string} token 
 * @returns {object|null}
 */
export const decodeToken = (token) => {
  if (!token) return null;
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return null;
    
    // Replace base64url characters to standard base64
    const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Retrieves the current logged in user from local storage token
 * @returns {object|null} The decoded user info, or null
 */
export function getUser() {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) return null;
  return decodeToken(token);
}

/**
 * Checks if a user is currently logged in
 * @returns {boolean}
 */
export function isLoggedIn() {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) return false;
  
  const payload = decodeToken(token);
  if (!payload) return false;

  // Check if token is expired
  if (payload.exp) {
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp < currentTime) {
      logout();
      return false;
    }
  }

  return true;
}

/**
 * Log out the current user by removing the token
 */
export function logout() {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
}

