import { apiRequest } from './api.js'

export const register = (user) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(user) })

export const login = (credentials) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) })

export const logout = () => apiRequest('/auth/logout', { method: 'POST' })

export const getMe = () => apiRequest('/auth/me')
