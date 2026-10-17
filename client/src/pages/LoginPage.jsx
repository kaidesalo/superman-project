import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'
import AuthCard from '../components/AuthCard.jsx'
import { inputClass } from '../utils/inputClass.js'
import ErrorMessage from '../components/ErrorMessage.jsx'

function LoginPage() {
  const { user, loading, login } = useAuth()
  const navigate = useNavigate()
  const [values, setValues] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) return null
  if (user) return <Navigate to="/courses" replace />

  const handleChange = (event) => setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!values.email.trim() || !values.password) {
      setError('Email and password are required')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await login(values)
      navigate('/courses')
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <AuthCard title="Sign In" subtitle="Welcome back to VulpiCourse">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <ErrorMessage message={error} />
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-800">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" value={values.email} onChange={handleChange} className={inputClass(false)} />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-slate-800">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" value={values.password} onChange={handleChange} className={inputClass(false)} />
        </div>
        <button type="submit" disabled={submitting} className="w-full rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60">
          {submitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        New to VulpiCourse?{' '}
        <Link to="/register" className="font-medium text-blue-600 hover:underline">Create an account</Link>
      </p>
    </AuthCard>
  )
}

export default LoginPage
