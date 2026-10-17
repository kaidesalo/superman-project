import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { createCourse, getCourse, updateCourse } from '../services/courseService.js'
import CourseForm from '../components/CourseForm.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import useAuth from '../hooks/useAuth.js'
import { canManageCourse } from '../utils/canManageCourse.js'

// Handles both /courses/new and /courses/:id/edit
function CourseFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading: authLoading } = useAuth()

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(isEdit)
  const [loadError, setLoadError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [serverErrors, setServerErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    getCourse(id)
      .then(setCourse)
      .catch((err) => setLoadError(err.status === 404 || err.status === 400 ? 'Course not found.' : err.message))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const handleSubmit = async (values) => {
    setSubmitting(true)
    setSaveError('')
    setServerErrors({})
    try {
      const saved = isEdit ? await updateCourse(id, values) : await createCourse(values)
      navigate(`/courses/${saved._id}`, {
        state: { message: isEdit ? 'Course updated.' : 'Course created.' },
      })
    } catch (err) {
      const hasFieldErrors = Object.keys(err.errors || {}).length > 0
      setSaveError(hasFieldErrors ? 'Please fix the highlighted fields.' : err.message)
      setServerErrors(err.errors || {})
      setSubmitting(false)
    }
  }

  if (authLoading) return <LoadingSpinner label="Checking your account..." />
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />

  // The server rejects these requests too; this just explains why instead of showing a form that can't be saved.
  let accessError = ''
  if (user.role !== 'teacher') accessError = 'Only teachers can create or edit courses.'
  else if (isEdit && course && !canManageCourse(user, course)) accessError = 'You can only edit courses you created.'

  if (accessError) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 px-4 py-8 sm:px-6">
        <ErrorMessage message={accessError} />
        <Link to={isEdit ? `/courses/${id}` : '/courses'} className="text-sm font-medium text-blue-600 hover:underline">
          &larr; Back
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">{isEdit ? 'Edit Course' : 'Create New Course'}</h1>

        {loading && <LoadingSpinner label="Loading course..." />}
        <ErrorMessage message={loadError} />

        {!loading && !loadError && (
          <>
            {saveError && (
              <div className="mb-4">
                <ErrorMessage message={saveError} />
              </div>
            )}
            <CourseForm
              initialValues={course || undefined}
              submitLabel={isEdit ? 'Save Changes' : 'Create Course'}
              onSubmit={handleSubmit}
              onCancel={() => navigate(isEdit ? `/courses/${id}` : '/courses')}
              serverErrors={serverErrors}
              submitting={submitting}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default CourseFormPage
