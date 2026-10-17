import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { getMySchedule, removeFromSchedule } from '../services/enrollmentService.js'
import SubjectBadge from '../components/SubjectBadge.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import SuccessMessage from '../components/SuccessMessage.jsx'
import useAuth from '../hooks/useAuth.js'

function SchedulePage() {
  const { user, loading: authLoading } = useAuth()
  const location = useLocation()
  const isStudent = user?.role === 'student'

  const [result, setResult] = useState({ loaded: false, enrollments: [], error: '' })
  const [message, setMessage] = useState('')
  const [actionError, setActionError] = useState('')
  const [removingId, setRemovingId] = useState('')

  useEffect(() => {
    if (!isStudent) return
    let active = true
    getMySchedule()
      .then((data) => active && setResult({ loaded: true, enrollments: data, error: '' }))
      .catch((err) => active && setResult({ loaded: true, enrollments: [], error: err.message }))
    return () => {
      active = false
    }
  }, [isStudent])

  const dropFromList = (courseId) =>
    setResult((prev) => ({ ...prev, enrollments: prev.enrollments.filter((e) => e.course?._id !== courseId) }))

  const handleRemove = async (course) => {
    setRemovingId(course._id)
    setMessage('')
    setActionError('')
    try {
      await removeFromSchedule(course._id)
      dropFromList(course._id)
      setMessage(`${course.courseNumber} was removed from your schedule. It is still in the course catalog.`)
    } catch (err) {
      // 404 means it was already removed (for example in another tab)
      if (err.status === 404) dropFromList(course._id)
      setActionError(err.message)
    } finally {
      setRemovingId('')
    }
  }

  if (authLoading) return <LoadingSpinner label="Checking your account..." />
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (!isStudent) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 px-4 py-8 sm:px-6">
        <ErrorMessage message="Only students have a schedule." />
        <Link to="/courses" className="text-sm font-medium text-blue-600 hover:underline">
          &larr; Back to Courses
        </Link>
      </div>
    )
  }

  // Skip any enrollment whose course no longer exists
  const courses = result.enrollments.map((enrollment) => enrollment.course).filter(Boolean)
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0)

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">My Schedule</h1>
      <p className="mt-1 text-slate-600">Courses you have added to your schedule.</p>

      <div className="mt-6 space-y-4">
        <SuccessMessage message={message} />
        <ErrorMessage message={actionError} />
        {!result.loaded && <LoadingSpinner label="Loading your schedule..." />}
        <ErrorMessage message={result.error} />

        {result.loaded && !result.error && (
          <>
            <p className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-lg font-semibold text-slate-900 shadow-sm">
              {courses.length} {courses.length === 1 ? 'Course' : 'Courses'}
              <span className="mx-3 text-slate-300">|</span>
              {totalCredits} Total Credits
            </p>

            {courses.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
                <p>Your schedule is empty.</p>
                <Link to="/courses" className="mt-2 inline-block font-medium text-blue-600 hover:underline">
                  Browse courses
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white shadow-sm">
                {courses.map((course) => (
                  <li key={course._id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <Link to={`/courses/${course._id}`} className="hover:underline">
                        <span className="font-bold text-slate-900">{course.courseNumber}</span>
                        <span className="ml-2 text-slate-700">{course.courseName}</span>
                      </Link>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <SubjectBadge subject={course.subjectArea} />
                        <span className="text-sm text-slate-600">{course.credits} credits</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(course)}
                      disabled={removingId === course._id}
                      className="self-start rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60 sm:self-center"
                    >
                      {removingId === course._id ? 'Removing...' : 'Remove'}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default SchedulePage
