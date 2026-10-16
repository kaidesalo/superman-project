import { useEffect, useState } from 'react'
import { getCourses } from '../services/courseService.js'
import CourseCard from '../components/CourseCard.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'

function CourseListPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getCourses()
      .then(setCourses)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Course Catalog</h1>
      <p className="mt-1 text-slate-600">Browse available courses.</p>

      <div className="mt-6">
        {loading && <LoadingSpinner label="Loading courses..." />}
        <ErrorMessage message={error} />

        {!loading && !error && (
          <>
            <p className="mb-4 text-sm text-slate-500">
              {courses.length} {courses.length === 1 ? 'course' : 'courses'} found
            </p>
            {courses.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
                No courses yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default CourseListPage
