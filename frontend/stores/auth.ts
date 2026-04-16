import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(username: string, password: string) {
      const { apiFetch } = useApi()
      const data = await apiFetch<{ access_token: string }>('/auth/login', {
        method: 'POST',
        body: { username, password },
      })
      this.token = data.access_token
      if (import.meta.client) {
        localStorage.setItem('admin_token', data.access_token)
      }
    },
    logout() {
      this.token = null
      if (import.meta.client) {
        localStorage.removeItem('admin_token')
      }
      navigateTo('/admin/login')
    },
    init() {
      if (import.meta.client) {
        this.token = localStorage.getItem('admin_token')
      }
    },
  },
})
