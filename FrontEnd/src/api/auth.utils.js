export function isLoggedIn() {
  return !!localStorage.getItem('token')
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
