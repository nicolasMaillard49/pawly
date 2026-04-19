import { storeConfig } from '~/config/store.config'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const pixelId = (config.public.metaPixelId as string) || storeConfig.analytics.metaPixelId
  if (!pixelId) return

  useHead({
    script: [
      {
        key: 'meta-pixel',
        tagPosition: 'head',
        innerHTML: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`,
      },
    ],
    noscript: [
      {
        key: 'meta-pixel-noscript',
        innerHTML: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1" />`,
      },
    ],
  })

  if (import.meta.client) {
    const router = useRouter()
    router.afterEach(() => {
      const w = window as any
      if (w.fbq) w.fbq('track', 'PageView')
    })
  }
})
