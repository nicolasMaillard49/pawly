export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  authStore.init()

  if (!authStore.isAuthenticated && to.path !== '/admin/login') {
    return navigateTo('/admin/login')
  }
})
