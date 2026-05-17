// Centralized auth helpers
export const getToken = () => localStorage.getItem('token')
export const getUser = () => {
  const token = getToken()
  if (!token) return null
  try {
    // Decode JWT payload (base64) — no library needed
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload
  } catch {
    return null
  }
}
export const isLoggedIn = () => !!getToken()
export const logout = () => localStorage.removeItem('token')
