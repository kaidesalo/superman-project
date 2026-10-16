import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext.js'
import * as authService from '../services/authService.js'

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
      .then((me) => active && setUser(me))
      .catch(() => active && setUser(null))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  const login = async (credentials) => {
    const signedIn = await authService.login(credentials)
    setUser(signedIn)
    return signedIn
  }

  const register = async (details) => {
    const created = await authService.register(details)
    setUser(created)
    return created
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}
