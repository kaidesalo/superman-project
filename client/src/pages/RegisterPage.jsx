import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'
import AuthCard from '../components/AuthCard.jsx'
import { inputClass } from '../utils/inputClass.js'
import ErrorMessage from '../components/ErrorMessage.jsx'

const validate = (values) => {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Name is required'
  if (!values.email.trim()) errors.email = 'Email is required'
  else if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) errors.email = 'Email must be a valid email address'
  if (values.password.length < 8) errors.password = 'Password must be at least 8 characters'
  if (!values.role) errors.role = 'Choose teacher or student'
  return errors
}

function RegisterPage() {
  const { user, loading, register } = useAuth()
  const navigate = useNavigate()
  const [values, setValues] = useState({ name: '', email: '', password: '', role: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) return null
  if (user) return <Navigate to="/courses" replace />

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)
    setFormError('')
    if (Object.keys(found).length > 0) return

    setSubmitting(true)
    try {
      await register({ ...values, email: values.email.trim() })
      navigate('/courses')
    } catch (err) {
      const fieldErrors = err.errors || {}
      setErrors(fieldErrors)
      setFormError(Object.keys(fieldErrors).length > 0 ? 'Please fix the highlighted fields.' : err.message)
      setSubmitting(false)
    }
  }

  const fieldError = (name) =>
    errors[name] && (
      <p id={`${name}-error`} className="mt-1 text-sm text-red-600">
        {errors[name]}
      </p>
    )

  const textField = (name, label, type, autoComplete) => (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-slate-800">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        value={values[name]}
        onChange={handleChange}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        className={inputClass(errors[name])}
      />
      {fieldError(name)}
    </div>
  )

  return (
    <AuthCard title="Create Account" subtitle="Join VulpiCourse as a teacher or student">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <ErrorMessage message={formError} />
        {textField('name', 'Name', 'text', 'name')}
        {textField('email', 'Email', 'email', 'email')}
        {textField('password', 'Password', 'password', 'new-password')}

        <fieldset aria-describedby={errors.role ? 'role-error' : undefined}>
          <legend className="block text-sm font-semibold text-slate-800">I am a...</legend>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {['teacher', 'student'].map((role) => (
              <label
                key={role}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium capitalize ${
                  values.role === role ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-300 text-slate-700'
                }`}
              >
                <input type="radio" name="role" value={role} checked={values.role === role} onChange={handleChange} className="accent-orange-500" />
                {role}
              </label>
            ))}
          </div>
          {fieldError('role')}
        </fieldset>

        <button type="submit" disabled={submitting} className="w-full rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60">
          {submitting ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-blue-600 hover:underline">Sign in</Link>
      </p>
    </AuthCard>
  )
}

export default RegisterPage
