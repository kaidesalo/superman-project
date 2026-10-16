import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="text-3xl font-bold text-slate-900">Page not found</h1>
      <Link to="/courses" className="mt-6 inline-block font-medium text-orange-600 hover:underline">
        Go to the course catalog
      </Link>
    </div>
  )
}

export default NotFoundPage
