import { Link } from 'react-router-dom'
import SubjectBadge from './SubjectBadge.jsx'

function CourseCard({ course }) {
  return (
    <Link
      to={`/courses/${course._id}`}
      className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-orange-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="font-bold text-slate-900">{course.courseNumber}</h2>
          <p className="font-semibold text-slate-800">{course.courseName}</p>
        </div>
        <span className="text-slate-400 group-hover:text-orange-500" aria-hidden="true">
          &rsaquo;
        </span>
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-slate-500">{course.description}</p>
      <div className="mt-auto flex items-center justify-between pt-4">
        <SubjectBadge subject={course.subjectArea} />
        <span className="text-sm text-slate-600">{course.credits} credits</span>
      </div>
    </Link>
  )
}

export default CourseCard
