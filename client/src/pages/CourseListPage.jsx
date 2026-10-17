import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getCourses } from '../services/courseService.js'
import CourseCard from '../components/CourseCard.jsx'
import SearchBar from '../components/SearchBar.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import SuccessMessage from '../components/SuccessMessage.jsx'
import useFlashMessage from '../hooks/useFlashMessage.js'

function CourseListPage() {
  const successMessage = useFlashMessage()
  // The search lives in the URL (?search=csci) so it survives reload and Back
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('search') || ''

  // Remembers which search the current results belong to, so a new search shows the spinner
  const [result, setResult] = useState({ search: null, courses: [], error: '' })
  const loading = result.search !== search
  const { courses, error } = result

  useEffect(() => {
    let active = true
    getCourses(search)
      .then((data) => active && setResult({ search, courses: data, error: '' }))
      .catch((err) => active && setResult({ search, courses: [], error: err.message }))
    return () => {
      active = false
    }
  }, [search])

  const handleSearch = (value) => setSearchParams(value ? { search: value } : {})

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Course Catalog</h1>
      <p className="mt-1 text-slate-600">Browse available courses.</p>

      <div className="mt-6 space-y-4">
        <SearchBar key={search} initialValue={search} onSearch={handleSearch} placeholder="Search by course name or number" />
        <SuccessMessage message={successMessage} />
        {loading && <LoadingSpinner label="Loading courses..." />}
        <ErrorMessage message={error} />

        {!loading && !error && (
          <div className="space-y-4">
            <p className="text-sm text-slate-500">
              {courses.length} {courses.length === 1 ? 'course' : 'courses'} found
              {search && <> for &ldquo;{search}&rdquo;</>}
            </p>
            {courses.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
                {search ? `No courses match "${search}".` : 'No courses yet.'}
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseListPage
