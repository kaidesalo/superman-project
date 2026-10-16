import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCourse } from '../services/courseService.js'
import CourseForm from '../components/CourseForm.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'

// Handles both /courses/new and /courses/:id/edit
function CourseFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(isEdit)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!isEdit) return
    getCourse(id)
      .then(setCourse)
      .catch((err) => setError(err.status === 404 || err.status === 400 ? 'Course not found.' : err.message))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  // Saving to the API is wired up in Phase 5
  const handleSubmit = () => {
    setNotice('Form is valid. Saving to the server will be connected in Phase 5.')
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">{isEdit ? 'Edit Course' : 'Create New Course'}</h1>

        {loading && <LoadingSpinner label="Loading course..." />}
        <ErrorMessage message={error} />
        {notice && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700" role="status">
            {notice}
          </div>
        )}

        {!loading && !error && (
          <CourseForm
            initialValues={course || undefined}
            submitLabel={isEdit ? 'Save Changes' : 'Create Course'}
            onSubmit={handleSubmit}
            onCancel={() => navigate(isEdit ? `/courses/${id}` : '/courses')}
          />
        )}
      </div>
    </div>
  )
}

export default CourseFormPage
