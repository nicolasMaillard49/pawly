import { storeConfig } from '~/config/store.config'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const ga4Id = (config.public.ga4Id as string) || storeConfig.analytics.ga4Id
  if (!ga4Id) return

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`
  document.head.appendChild(script)

  const w = window as any
  w.dataLayer = w.dataLayer || []
  function gtag(...args: any[]) { w.dataLayer.push(args) }
  w.gtag = gtag
  gtag('js', new Date())
  gtag('config', ga4Id, { send_page_view: false })

  const router = useRouter()
  const sendPageView = (path: string) => {
    gtag('event', 'page_view', {
      page_path: path,
      page_title: document.title,
      page_location: window.location.href,
    })
  }

  sendPageView(router.currentRoute.value.fullPath)
  router.afterEach((to) => sendPageView(to.fullPath))
})
