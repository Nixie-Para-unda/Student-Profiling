import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isDean: (state) => state.user?.role === 'dean',
    isFaculty: (state) => state.user?.role === 'faculty',
    isStudent: (state) => state.user?.role === 'student',
    isSecretary: (state) => state.user?.role === 'secretary',
    isChair: (state) => state.user?.role === 'department_chair'
  },
  actions: {
    async login(email, password, role = null) {
      try {
        const payload = { email, password }
        if (role) payload.role = role
        
        const response = await axios.post('/login', payload)
        this.user = response.data.user
        this.token = response.data.token
        localStorage.setItem('user', JSON.stringify(this.user))
        localStorage.setItem('token', this.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        axios.defaults.headers.common['Accept'] = 'application/json'
        return true
      } catch (error) {
        console.error('Login failed:', error)
        throw error
      }
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    }
  }
})
