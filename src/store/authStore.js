import { create } from 'zustand'

const useAuthStore = create((set) => ({
  token: localStorage.getItem('adminToken') || null,
  isAuthenticated: !!localStorage.getItem('adminToken'),

  login: (token) => {
    localStorage.setItem('adminToken', token)
    set({ token, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('adminToken')
    set({ token: null, isAuthenticated: false })
  },
}))

export default useAuthStore