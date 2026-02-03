'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'analyst' | 'viewer'
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// API URL for authentication
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://afpi-backend-43847292060.us-central1.run.app'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('afpi_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        localStorage.removeItem('afpi_user')
      }
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Redirect to login if not authenticated and not already on login page
    if (!isLoading && !user && pathname !== '/login') {
      router.push('/login')
    }
  }, [user, isLoading, pathname, router])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        const loggedInUser: User = {
          id: data.id || '1',
          email: data.email,
          name: data.name || email.split('@')[0],
          role: data.role || 'viewer',
        }
        setUser(loggedInUser)
        localStorage.setItem('afpi_user', JSON.stringify(loggedInUser))
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('afpi_user')
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
