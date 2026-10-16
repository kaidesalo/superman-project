// Central place for talking to the Express API.
// credentials: 'include' sends the HTTP-only auth cookie with every request.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export async function apiRequest(path, { headers, ...options } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...headers },
    ...options,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    // error.errors holds field messages from the API, e.g. { credits: 'Credits must be greater than zero' }
    const error = new Error(data.message || `Request failed (${response.status})`)
    error.status = response.status
    error.errors = data.errors || {}
    throw error
  }

  return data
}

export const getHealth = () => apiRequest('/health')
