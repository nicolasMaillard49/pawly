export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxtjs/sitemap'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000/api',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:4000',
      metaPixelId: process.env.NUXT_PUBLIC_META_PIXEL_ID || '',
      ga4Id: process.env.NUXT_PUBLIC_GA4_ID || '',
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      title: 'Pawly — Pommeau de douche pour chien et chat | Laver les pattes en 5 secondes',
      meta: [
        { name: 'description', content: 'Pawly, la douchette à pattes pour chien et chat. Branchez-la sur votre douche et lavez les pattes boueuses en 5 secondes — sans bain complet, sans lingettes, sans stress. Jet doux adapté aux coussinets. Livraison gratuite en France.' },
        { name: 'keywords', content: 'pommeau douche chien, douchette chien, laver pattes chien, nettoyer pattes chat, accessoire toilettage animal, douche chien, douche chat, pattes boueuses, pommeau patte, douchette animal compagnie, Pawly' },
        { name: 'robots', content: 'index, follow, max-image-preview:large' },
        { name: 'author', content: 'Pawly' },
        { name: 'application-name', content: 'Pawly' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'fr_FR' },
        { property: 'og:site_name', content: 'Pawly' },
        { property: 'og:title', content: 'Pawly — Pommeau de douche pour chien et chat' },
        { property: 'og:description', content: 'La douchette à pattes pour chien et chat. Lavez les pattes boueuses de votre compagnon en 5 secondes, sans bain complet.' },
        { property: 'og:image', content: '/og.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:type', content: 'image/png' },
        { property: 'og:image:alt', content: 'Pawly - Pommeau de douche pour pattes de chien et chat' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: '/og.png' },
        { name: 'twitter:title', content: 'Pawly — Pommeau de douche pour chien et chat' },
        { name: 'twitter:description', content: 'La douchette à pattes pour chien et chat. Lavez les pattes boueuses en 5 secondes, sans bain complet.' },
        { name: 'theme-color', content: '#9BCBEB' },
      ],
      // Analytics scripts (Meta Pixel, GA4) are injected dynamically
      // via the useMetaPixel composable and storeConfig.analytics IDs.
      // Set NUXT_PUBLIC_META_PIXEL_ID env var or storeConfig.analytics values.
      link: [
        { rel: 'icon', type: 'image/png', href: '/images/logo_blue.png' },
        { rel: 'apple-touch-icon', href: '/images/logo_blue.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;500;600;700&display=swap' },
        { rel: 'preload', as: 'image', href: '/images/product/product-2.png' },
      ],
    },
  },
  routeRules: {
    '/': { swr: 180 },
    '/mentions-legales': { swr: 86400 },
    '/cgv': { swr: 86400 },
    '/confidentialite': { swr: 86400 },
    '/admin/**': { ssr: false },
    '/success': { ssr: false },
  },
  sitemap: {
    siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:4000',
    exclude: ['/admin/**', '/success', '/cancel'],
  },
  devServer: {
    port: 4001,
    host: '0.0.0.0',
  },
  nitro: {
    compressPublicAssets: true,
  },
})
