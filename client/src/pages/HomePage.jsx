import { Link } from 'react-router-dom'
import FoxLogo from '../components/FoxLogo.jsx'

const FEATURES = [
  { title: 'Explore Courses', text: 'Browse courses by subject, name, or number.' },
  { title: 'Build Your Schedule', text: 'Add courses to your personal schedule.' },
  { title: 'For Teachers & Students', text: 'Teachers manage courses. Students build schedules.' },
]

function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <section className="flex flex-col-reverse items-center gap-10 md:flex-row md:justify-between">
        <div className="max-w-xl">
          <h1 className="text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
            Find Your <br />
            Next <span className="text-orange-500">Great Class</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Explore courses, build your schedule, and reach your academic goals.
          </p>
          <Link
            to="/courses"
            className="mt-8 inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Browse Courses
          </Link>
        </div>
        <FoxLogo className="h-40 w-40 sm:h-56 sm:w-56" />
      </section>

      <section className="mt-16 grid gap-6 sm:grid-cols-3">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-bold text-slate-900">{feature.title}</h2>
            <p className="mt-2 text-sm text-slate-500">{feature.text}</p>
          </div>
        ))}
      </section>
    </div>
  )
}

export default HomePage
