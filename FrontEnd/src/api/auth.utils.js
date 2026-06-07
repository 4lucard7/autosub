export function isLoggedIn() {
  const token = localStorage.getItem('token')
  if (!token) return false

  // Check if the JWT is expired
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      // Token has expired — clean up
      logout()
      return false
    }
  } catch (e) {
    // Malformed token — treat as not logged in
    logout()
    return false
  }

  return true
}

export function getUser() {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}
