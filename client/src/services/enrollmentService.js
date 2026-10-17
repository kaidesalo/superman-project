import { apiRequest } from './api.js'

// Student schedule endpoints. The server works out the student from the login cookie.
export const getMySchedule = () => apiRequest('/enrollments/me')

export const addToSchedule = (courseId) =>
  apiRequest('/enrollments', { method: 'POST', body: JSON.stringify({ courseId }) })

// Removes the course from the schedule only; the course stays in the catalog
export const removeFromSchedule = (courseId) => apiRequest(`/enrollments/${courseId}`, { method: 'DELETE' })
