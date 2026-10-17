import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import FoxLogo from './FoxLogo.jsx'
import useAuth from '../hooks/useAuth.js'

const linkClass = ({ isActive }) =>
  `px-1 py-5 text-sm font-medium border-b-2 transition-colors ${
    isActive ? 'border-orange-500 text-white' : 'border-transparent text-slate-300 hover:text-white'
  }`

function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, loading, logout } = useAuth()
  // Courses stays active on catalog, details and edit pages, but not on Add Course
  const onCoursePages = pathname.startsWith('/courses') && pathname !== '/courses/new'

  const handleSignOut = async () => {
    await logout()
    navigate('/courses')
  }

  return (
    <header className="bg-slate-900">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 px-4 sm:px-6" aria-label="Main">
        <Link to="/" className="flex items-center gap-2 py-3">
          <FoxLogo />
          <span className="text-xl font-bold text-white">
            Vulpi<span className="text-orange-500">Course</span>
          </span>
        </Link>

        <div className="flex flex-1 items-center gap-5">
          <NavLink to="/courses" className={() => linkClass({ isActive: onCoursePages })}>
            Courses
          </NavLink>
          {user?.role === 'teacher' && (
            <NavLink to="/courses/new" className={linkClass}>
              Add Course
            </NavLink>
          )}
          {/* Students get "My Schedule" here in Milestone 2 */}

          {!loading && (
            <div className="ml-auto flex items-center gap-4">
              {user ? (
                <>
                  <span className="hidden text-sm text-slate-400 sm:inline">
                    {user.name} <span className="capitalize">({user.role})</span>
                  </span>
                  <button type="button" onClick={handleSignOut} className="text-sm font-medium text-slate-300 hover:text-white">
                    Sign Out
                  </button>
                </>
              ) : (
                <NavLink to="/login" className={linkClass}>
                  Sign In
                </NavLink>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar
