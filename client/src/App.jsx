import { Fragment } from 'react'
import { Routes, Route, useParams } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import HomePage from './pages/HomePage.jsx'
import CourseListPage from './pages/CourseListPage.jsx'
import CourseDetailsPage from './pages/CourseDetailsPage.jsx'
import CourseFormPage from './pages/CourseFormPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import SchedulePage from './pages/SchedulePage.jsx'

// React keeps a page mounted when only :id changes (e.g. Back from one course to another).
// Keying by id gives each course a fresh page, so old course data or form values never carry over.
function ResetOnIdChange({ children }) {
  const { id } = useParams()
  return <Fragment key={id}>{children}</Fragment>
}

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CourseListPage />} />
          <Route path="/courses/new" element={<CourseFormPage key="new" />} />
          <Route path="/courses/:id" element={<ResetOnIdChange><CourseDetailsPage /></ResetOnIdChange>} />
          <Route path="/courses/:id/edit" element={<ResetOnIdChange><CourseFormPage key="edit" /></ResetOnIdChange>} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
