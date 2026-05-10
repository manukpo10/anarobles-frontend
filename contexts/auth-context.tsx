"use client"

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  avatar?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateUser: (data: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = "anacecilia-auth"
const MOCK_ADMIN = {
  id: "admin-1",
  name: "Ana Cecilia Robles",
  email: "admin@anacecilia.art",
  password: "admin123",
  role: "admin" as const,
  avatar: "/artist-portrait.jpg"
}

const MOCK_USERS: Record<string, { password: string; user: Omit<User, "id"> }> = {
  "usuario@test.com": {
    password: "user123",
    user: {
      name: "María García",
      email: "usuario@test.com",
      role: "user"
    }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedAuth = localStorage.getItem(STORAGE_KEY)
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth)
        setUser(parsed)
        if (parsed.token) {
          setToken(parsed.token)
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      
      if (res.ok) {
        const data = await res.json()
        const backendToken = data.token
        
        let userData: User
        if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
          userData = {
            id: MOCK_ADMIN.id,
            name: MOCK_ADMIN.name,
            email: MOCK_ADMIN.email,
            role: "admin",
            avatar: MOCK_ADMIN.avatar
          }
        } else {
          userData = {
            id: "user-backend-1",
            name: email.split("@")[0],
            email: email,
            role: "user"
          }
        }
        
        setUser(userData)
        setToken(backendToken)
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...userData, token: backendToken }))
        return { success: true }
      }
    } catch (error) {
      console.warn("Backend no disponible, usando autenticación local")
    }

    await new Promise(resolve => setTimeout(resolve, 800))

    if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
      const userData: User = {
        id: MOCK_ADMIN.id,
        name: MOCK_ADMIN.name,
        email: MOCK_ADMIN.email,
        role: "admin",
        avatar: MOCK_ADMIN.avatar
      }
      setUser(userData)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
      return { success: true }
    }

    if (MOCK_USERS[email]?.password === password) {
      const userData: User = {
        id: "user-test-1",
        name: MOCK_USERS[email].user.name,
        email: MOCK_USERS[email].user.email,
        role: MOCK_USERS[email].user.role
      }
      setUser(userData)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
      return { success: true }
    }

    return { success: false, error: "Email o contraseña incorrectos" }
  }, [])

  const register = useCallback(async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 800))

    if (MOCK_USERS[email] || email === MOCK_ADMIN.email) {
      return { success: false, error: "Este email ya está registrado" }
    }

    if (password.length < 6) {
      return { success: false, error: "La contraseña debe tener al menos 6 caracteres" }
    }

    MOCK_USERS[email] = {
      password,
      user: { name, email, role: "user" }
    }

    const userData: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: "user"
    }
    setUser(userData)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const updateUser = useCallback((data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null
      const updated = { ...prev, ...data }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}