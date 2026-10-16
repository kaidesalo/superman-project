import { useState } from 'react'

const SUBJECT_SUGGESTIONS = ['Computer Science', 'Mathematics', 'English', 'Biology', 'Chemistry', 'History']

const EMPTY_COURSE = {
  courseName: '',
  courseNumber: '',
  description: '',
  subjectArea: '',
  credits: '',
}

// Quick checks before sending; the server still validates everything
const validate = (values) => {
  const errors = {}
  if (!values.courseName.trim()) errors.courseName = 'Course name is required'
  if (!values.courseNumber.trim()) errors.courseNumber = 'Course number is required'
  if (!values.description.trim()) errors.description = 'Description is required'
  if (!values.subjectArea.trim()) errors.subjectArea = 'Subject area is required'
  if (values.credits === '') errors.credits = 'Credits are required'
  else if (Number(values.credits) <= 0) errors.credits = 'Credits must be greater than zero'
  return errors
}

const inputClass = (hasError) =>
  `mt-1 block w-full rounded-lg border px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
    hasError ? 'border-red-400' : 'border-slate-300'
  }`

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-800">
        {label} <span className="text-orange-500">*</span>
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

// Reusable for both Create and Edit. serverErrors are field messages returned by the API.
function CourseForm({ initialValues = EMPTY_COURSE, submitLabel, onSubmit, onCancel, serverErrors = {}, submitting = false }) {
  const [values, setValues] = useState({ ...EMPTY_COURSE, ...initialValues })
  const [errors, setErrors] = useState({})

  const allErrors = { ...serverErrors, ...errors }

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const formErrors = validate(values)
    setErrors(formErrors)
    if (Object.keys(formErrors).length > 0) return
    onSubmit({ ...values, credits: Number(values.credits) })
  }

  const describedBy = (name) => (allErrors[name] ? `${name}-error` : undefined)

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Field id="courseName" label="Course Name" error={allErrors.courseName}>
        <input
          id="courseName"
          name="courseName"
          value={values.courseName}
          onChange={handleChange}
          placeholder="Introduction to Programming"
          aria-invalid={!!allErrors.courseName}
          aria-describedby={describedBy('courseName')}
          className={inputClass(allErrors.courseName)}
        />
      </Field>

      <Field id="courseNumber" label="Course Number" error={allErrors.courseNumber}>
        <input
          id="courseNumber"
          name="courseNumber"
          value={values.courseNumber}
          onChange={handleChange}
          placeholder="CSCI 101"
          aria-invalid={!!allErrors.courseNumber}
          aria-describedby={describedBy('courseNumber')}
          className={inputClass(allErrors.courseNumber)}
        />
      </Field>

      <Field id="description" label="Description" error={allErrors.description}>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={values.description}
          onChange={handleChange}
          placeholder="An introductory course covering programming fundamentals."
          aria-invalid={!!allErrors.description}
          aria-describedby={describedBy('description')}
          className={inputClass(allErrors.description)}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <Field id="subjectArea" label="Subject Area" error={allErrors.subjectArea}>
            <input
              id="subjectArea"
              name="subjectArea"
              list="subject-suggestions"
              value={values.subjectArea}
              onChange={handleChange}
              placeholder="Computer Science"
              aria-invalid={!!allErrors.subjectArea}
              aria-describedby={describedBy('subjectArea')}
              className={inputClass(allErrors.subjectArea)}
            />
            <datalist id="subject-suggestions">
              {SUBJECT_SUGGESTIONS.map((subject) => (
                <option key={subject} value={subject} />
              ))}
            </datalist>
          </Field>
        </div>

        <Field id="credits" label="Credits" error={allErrors.credits}>
          <input
            id="credits"
            name="credits"
            type="number"
            min="1"
            step="1"
            value={values.credits}
            onChange={handleChange}
            placeholder="3"
            aria-invalid={!!allErrors.credits}
            aria-describedby={describedBy('credits')}
            className={inputClass(allErrors.credits)}
          />
        </Field>
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg bg-slate-200 px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
        >
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}

export default CourseForm
