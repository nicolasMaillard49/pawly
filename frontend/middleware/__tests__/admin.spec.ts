import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Mock useApi (auto-imported by Nuxt)
const mockApiFetch = vi.fn()
vi.stubGlobal('useApi', () => ({ apiFetch: mockApiFetch }))

// Mock navigateTo
const mockNavigateTo = vi.fn()
vi.stubGlobal('navigateTo', mockNavigateTo)

// Mock defineNuxtRouteMiddleware — captures the handler and returns it
let middlewareHandler: (to: { path: string }) => any
vi.stubGlobal('defineNuxtRouteMiddleware', (handler: any) => {
  middlewareHandler = handler
  return handler
})

// Mock useAuthStore globally (since the middleware uses it as an auto-import)
// We need to re-export the real store but make it available globally
import { useAuthStore } from '../../stores/auth'
vi.stubGlobal('useAuthStore', useAuthStore)

// NOW import the middleware — this triggers defineNuxtRouteMiddleware
await import('../../middleware/admin')

describe('admin middleware', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockNavigateTo.mockReset()
    localStorage.clear()
  })

  it('should redirect to /admin/login when not authenticated', () => {
    middlewareHandler({ path: '/admin' })

    expect(mockNavigateTo).toHaveBeenCalledWith('/admin/login')
  })

  it('should allow access when authenticated', () => {
    localStorage.setItem('admin_token', 'valid-token')

    middlewareHandler({ path: '/admin' })

    expect(mockNavigateTo).not.toHaveBeenCalled()
  })

  it('should not redirect if already on /admin/login', () => {
    middlewareHandler({ path: '/admin/login' })

    expect(mockNavigateTo).not.toHaveBeenCalled()
  })

  it('should call authStore.init() to restore token before checking', () => {
    localStorage.setItem('admin_token', 'restored-token')

    middlewareHandler({ path: '/admin/orders' })

    // Token was restored via init(), so no redirect
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })

  it('should redirect when token in localStorage is empty string', () => {
    localStorage.setItem('admin_token', '')

    middlewareHandler({ path: '/admin' })

    // Empty string is falsy → isAuthenticated = false
    expect(mockNavigateTo).toHaveBeenCalledWith('/admin/login')
  })
})
