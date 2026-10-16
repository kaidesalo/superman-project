import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCourse } from '../services/courseService.js'
import SubjectBadge from '../components/SubjectBadge.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'

function CourseDetailsPage() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getCourse(id)
      .then(setCourse)
      .catch((err) => setError(err.status === 404 || err.status === 400 ? 'Course not found.' : err.message))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link to="/courses" className="text-sm font-medium text-blue-600 hover:underline">
        &larr; Back to Courses
      </Link>

      <div className="mt-4">
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
              <Link
                to={`/courses/${course._id}/edit`}
                className="self-start rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Edit
              </Link>
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
