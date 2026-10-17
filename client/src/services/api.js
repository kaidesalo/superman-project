// Central place for talking to the Express API.
// credentials: 'include' sends the HTTP-only auth cookie with every request.
// In production the Express server serves this app, so the API is on the same address at /api.
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api')

export const SESSION_EXPIRED_EVENT = 'auth:session-expired'

// CSRF token from login/register/me, sent back on every request so the API knows
// it came from this app. Kept in memory only (never localStorage).
let csrfToken = ''
export const setCsrfToken = (token) => {
  csrfToken = token || ''
}

export async function apiRequest(path, { headers, ...options } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(csrfToken && { 'X-CSRF-Token': csrfToken }), ...headers },
    ...options,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    // A 401 outside /auth means the login cookie expired or is invalid;
    // AuthProvider listens for this and signs the user out of the UI.
    if (response.status === 401 && !path.startsWith('/auth/')) {
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
    }
    // error.errors holds field messages from the API, e.g. { credits: 'Credits must be greater than zero' }
    const error = new Error(data.message || `Request failed (${response.status})`)
    error.status = response.status
    error.errors = data.errors || {}
    throw error
  }

  return data
}

export const getHealth = () => apiRequest('/health')
