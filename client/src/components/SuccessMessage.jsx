function SuccessMessage({ message }) {
  if (!message) return null

  return (
    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700" role="status">
      {message}
    </div>
  )
}

export default SuccessMessage
