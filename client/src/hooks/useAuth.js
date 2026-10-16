import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext.js'

export default function useAuth() {
  return useContext(AuthContext)
}
