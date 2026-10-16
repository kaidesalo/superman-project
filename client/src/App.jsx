import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import HomePage from './pages/HomePage.jsx'
import CourseListPage from './pages/CourseListPage.jsx'
import CourseDetailsPage from './pages/CourseDetailsPage.jsx'
import CourseFormPage from './pages/CourseFormPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CourseListPage />} />
          <Route path="/courses/new" element={<CourseFormPage key="new" />} />
          <Route path="/courses/:id" element={<CourseDetailsPage />} />
          <Route path="/courses/:id/edit" element={<CourseFormPage key="edit" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
