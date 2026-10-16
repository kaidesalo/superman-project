import { apiRequest } from './api.js'

export const getCourses = () => apiRequest('/courses')

export const getCourse = (id) => apiRequest(`/courses/${id}`)

export const createCourse = (course) =>
  apiRequest('/courses', { method: 'POST', body: JSON.stringify(course) })

export const updateCourse = (id, course) =>
  apiRequest(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(course) })

export const deleteCourse = (id) => apiRequest(`/courses/${id}`, { method: 'DELETE' })
