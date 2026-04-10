import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('token') || null)

  const isAuthenticated = !!token

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      axios.defaults.headers.common['Accept'] = 'application/json'
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  const login = async (email, password, role = null) => {
    try {
      const payload = { email, password }
      if (role) payload.role = role
      
      const response = await axios.post('http://localhost:8000/api/login', payload)
      setUser(response.data.user)
      setToken(response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      localStorage.setItem('token', response.data.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
      return true
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const fetchUser = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/user')
      setUser(response.data)
      localStorage.setItem('user', JSON.stringify(response.data))
    } catch (error) {
      console.error('Fetch user failed:', error)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }

  const getDashboardRoute = () => {
    if (!user) return '/login'
    switch (user.role) {
      case 'student': return '/student/dashboard'
      case 'dean': return '/dean/dashboard'
      case 'secretary': return '/secretary/dashboard'
      case 'department_chair': return '/chair/dashboard'
      case 'faculty': return '/faculty/dashboard'
      default: return '/'
    }
  }

  const value = {
    user,
    token,
    isAuthenticated,
    login,
    fetchUser,
    logout,
    getDashboardRoute,
    isDean: user?.role === 'dean',
    isFaculty: user?.role === 'faculty',
    isStudent: user?.role === 'student',
    isSecretary: user?.role === 'secretary',
    isChair: user?.role === 'department_chair'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}