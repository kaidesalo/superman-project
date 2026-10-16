import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// Reads a one-time message passed via navigate(path, { state: { message } }),
// then clears it from history so it doesn't reappear on reload or Back.
export default function useFlashMessage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [message] = useState(location.state?.message || '')

  useEffect(() => {
    if (location.state?.message) {
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [location, navigate])

  return message
}
