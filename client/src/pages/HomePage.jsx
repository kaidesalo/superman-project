import { useEffect, useState } from 'react'
import { getHealth } from '../services/api.js'

function HomePage() {
  const [health, setHealth] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getHealth()
      .then(setHealth)
      .catch((err) => setError(err.message))
  }, [])

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-bold text-slate-900">
          Vulpi<span className="text-orange-500">Course</span>
        </h1>
        <p className="mt-2 text-slate-600">Phase 1 setup check</p>

        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="font-medium text-slate-700">React + Tailwind</dt>
            <dd className="text-green-600">working</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium text-slate-700">Express API</dt>
            <dd className={error ? 'text-red-600' : health ? 'text-green-600' : 'text-slate-400'}>
              {error ? 'unreachable' : health ? health.status : 'checking...'}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium text-slate-700">MongoDB</dt>
            <dd className={health?.database === 'connected' ? 'text-green-600' : 'text-slate-400'}>
              {health ? health.database : '—'}
            </dd>
          </div>
        </dl>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </div>
    </main>
  )
}

export default HomePage
