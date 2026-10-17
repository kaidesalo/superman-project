import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { deleteCourse, getCourse } from '../services/courseService.js'
import { addToSchedule, getMySchedule, removeFromSchedule } from '../services/enrollmentService.js'
import SubjectBadge from '../components/SubjectBadge.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import SuccessMessage from '../components/SuccessMessage.jsx'
import useFlashMessage from '../hooks/useFlashMessage.js'
import useAuth from '../hooks/useAuth.js'
import { canManageCourse } from '../utils/canManageCourse.js'

function CourseDetailsPage() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deleting, setDeleting] = useState(false)
  const navigate = useNavigate()
  const successMessage = useFlashMessage()
  const location = useLocation()
  const { user, loading: authLoading } = useAuth()
  const isStudent = user?.role === 'student'
  // null = not checked yet, so the schedule button doesn't flicker between states
  const [enrolled, setEnrolled] = useState(null)
  const [scheduleMessage, setScheduleMessage] = useState('')
  const [scheduleError, setScheduleError] = useState('')
  const [scheduleBusy, setScheduleBusy] = useState(false)

  useEffect(() => {
    getCourse(id)
      .then(setCourse)
      .catch((err) => setError(err.status === 404 || err.status === 400 ? 'Course not found.' : err.message))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!isStudent) return
    let active = true
    getMySchedule()
      .then((enrollments) => active && setEnrolled(enrollments.some((e) => e.course?._id === id)))
      .catch(() => active && setEnrolled(false))
    return () => {
      active = false
    }
  }, [isStudent, id])

  const handleAddToSchedule = async () => {
    setScheduleBusy(true)
    setScheduleMessage('')
    setScheduleError('')
    try {
      await addToSchedule(id)
      setEnrolled(true)
      setScheduleMessage(`${course.courseNumber} was added to your schedule.`)
    } catch (err) {
      // 409: it was already in the schedule (for example, added in another tab)
      if (err.status === 409) setEnrolled(true)
      setScheduleError(err.message)
    } finally {
      setScheduleBusy(false)
    }
  }

  const handleRemoveFromSchedule = async () => {
    setScheduleBusy(true)
    setScheduleMessage('')
    setScheduleError('')
    try {
      await removeFromSchedule(id)
      setEnrolled(false)
      setScheduleMessage(`${course.courseNumber} was removed from your schedule.`)
    } catch (err) {
      if (err.status === 404) setEnrolled(false)
      setScheduleError(err.message)
    } finally {
      setScheduleBusy(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${course.courseNumber}: ${course.courseName}? This cannot be undone.`)) return
    setDeleting(true)
    setDeleteError('')
    try {
      await deleteCourse(id)
      navigate('/courses', { state: { message: `${course.courseNumber} was deleted.` } })
    } catch (err) {
      setDeleteError(err.message)
      setDeleting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link to="/courses" className="text-sm font-medium text-blue-600 hover:underline">
        &larr; Back to Courses
      </Link>

      <div className="mt-4 space-y-4">
        <SuccessMessage message={successMessage} />
        <ErrorMessage message={deleteError} />
        <SuccessMessage message={scheduleMessage} />
        <ErrorMessage message={scheduleError} />
        {loading && <LoadingSpinner label="Loading course..." />}
        <ErrorMessage message={error} />

        {course && (
          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xl font-bold text-slate-900">{course.courseNumber}</p>
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{course.courseName}</h1>
                <div className="mt-3 flex flex-wrap gap-2">
                  <SubjectBadge subject={course.subjectArea} />
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {course.credits} credits
                  </span>
                </div>
              </div>
              {canManageCourse(user, course) && (
                <div className="flex gap-2 self-start">
                  <Link
                    to={`/courses/${course._id}/edit`}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              )}
              {isStudent && enrolled === false && (
                <button
                  type="button"
                  onClick={handleAddToSchedule}
                  disabled={scheduleBusy}
                  className="self-start rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
                >
                  {scheduleBusy ? 'Adding...' : 'Add to Schedule'}
                </button>
              )}
              {isStudent && enrolled === true && (
                <div className="flex flex-col items-start gap-2 sm:items-end">
                  <span className="rounded-md bg-green-50 px-2.5 py-1 text-sm font-medium text-green-700">
                    In your schedule &middot;{' '}
                    <Link to="/schedule" className="underline">
                      View
                    </Link>
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveFromSchedule}
                    disabled={scheduleBusy}
                    className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    {scheduleBusy ? 'Removing...' : 'Remove from Schedule'}
                  </button>
                </div>
              )}
              {!authLoading && !user && (
                <Link
                  to="/login"
                  state={{ from: location.pathname }}
                  className="self-start text-sm font-medium text-blue-600 hover:underline"
                >
                  Sign in to add this course to your schedule
                </Link>
              )}
            </div>

            <h2 className="mt-8 font-semibold text-slate-900">Description</h2>
            <p className="mt-2 text-slate-600">{course.description}</p>

            <dl className="mt-8 divide-y divide-slate-100 border-t border-slate-200 text-sm">
              {[
                ['Course Number', course.courseNumber],
                ['Course Name', course.courseName],
                ['Subject Area', course.subjectArea],
                ['Credits', course.credits],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-2 gap-4 py-3 sm:grid-cols-3">
                  <dt className="font-semibold text-slate-800">{label}</dt>
                  <dd className="text-slate-600 sm:col-span-2">{value}</dd>
                </div>
              ))}
            </dl>
          </article>
        )}
      </div>
    </div>
  )
}

export default CourseDetailsPage
