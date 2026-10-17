import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext.js'
import * as authService from '../services/authService.js'
import { SESSION_EXPIRED_EVENT, setCsrfToken } from '../services/api.js'

// Auth responses include the CSRF token next to the user fields; keep it out of the user object
const takeCsrfToken = ({ csrfToken, ...user }) => {
  setCsrfToken(csrfToken)
  return user
}

// Keeps track of the signed-in user. The JWT itself lives in an HTTP-only
// cookie that JavaScript can't read; we ask the server who we are via /auth/me.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Ignore a late response if the effect was cleaned up (e.g. React StrictMode
    // runs effects twice), so it can't overwrite a user who just signed in.
    let active = true
    authService
      .getMe()
      .then((me) => active && setUser(takeCsrfToken(me)))
      .catch(() => active && setUser(null))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const handleExpired = () => {
      setCsrfToken('')
      setUser(null)
    }
    window.addEventListener(SESSION_EXPIRED_EVENT, handleExpired)
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleExpired)
  }, [])

  const login = async (credentials) => {
    const signedIn = takeCsrfToken(await authService.login(credentials))
    setUser(signedIn)
    return signedIn
  }

  const register = async (details) => {
    const created = takeCsrfToken(await authService.register(details))
    setUser(created)
    return created
  }

  const logout = async () => {
    await authService.logout()
    setCsrfToken('')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}
