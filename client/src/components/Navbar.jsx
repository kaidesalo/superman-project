import { Link, NavLink, useLocation } from 'react-router-dom'
import FoxLogo from './FoxLogo.jsx'

const linkClass = ({ isActive }) =>
  `px-1 py-5 text-sm font-medium border-b-2 transition-colors ${
    isActive ? 'border-orange-500 text-white' : 'border-transparent text-slate-300 hover:text-white'
  }`

function Navbar() {
  const { pathname } = useLocation()
  // Courses stays active on catalog, details and edit pages, but not on Add Course
  const onCoursePages = pathname.startsWith('/courses') && pathname !== '/courses/new'

  return (
    <header className="bg-slate-900">
      <nav className="mx-auto flex max-w-6xl items-center gap-6 px-4 sm:px-6" aria-label="Main">
        <Link to="/" className="flex items-center gap-2 py-3">
          <FoxLogo />
          <span className="text-xl font-bold text-white">
            Vulpi<span className="text-orange-500">Course</span>
          </span>
        </Link>

        <div className="flex items-center gap-5">
          <NavLink to="/courses" className={() => linkClass({ isActive: onCoursePages })}>
            Courses
          </NavLink>
          {/* Shown to everyone until auth (Phase 6) limits it to teachers */}
          <NavLink to="/courses/new" className={linkClass}>
            Add Course
          </NavLink>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
