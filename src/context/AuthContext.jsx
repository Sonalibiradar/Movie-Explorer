import { createContext, useContext, useMemo, useState } from 'react'

const SESSION_KEY = 'movie_explorer_user'
const AuthContext = createContext(null)

function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession)

  const login = ({ username, password }) => {
    const name = username.trim()
    if (!name || password.length < 4) {
      throw new Error('Enter a username and a password with at least 4 characters.')
    }
    const next = { username: name }
    localStorage.setItem(SESSION_KEY, JSON.stringify(next))
    setUser(next)
  }

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  const value = useMemo(() => ({ user, login, logout }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
