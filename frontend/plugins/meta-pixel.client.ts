export default defineNuxtPlugin(() => {
  // PageView on SPA route changes (initial PageView is handled by the inline script in <head>)
  const router = useRouter()
  router.afterEach(() => {
    if ((window as any).fbq) {
      ;(window as any).fbq('track', 'PageView')
    }
  })
})
