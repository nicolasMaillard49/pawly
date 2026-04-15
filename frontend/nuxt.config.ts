export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxtjs/sitemap'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000/api',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:4000',
      metaPixelId: process.env.NUXT_PUBLIC_META_PIXEL_ID || '',
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      title: 'Pawly - Le pommeau de douche pour les pattes de votre compagnon',
      meta: [
        { name: 'description', content: 'Pawly est le pommeau de douche conçu pour nettoyer les pattes de votre chien ou chat. Branchez-le et rincez en quelques secondes. Livraison gratuite.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'fr_FR' },
        { property: 'og:site_name', content: 'Pawly' },
        { property: 'og:title', content: 'Pawly - Des pattes propres en quelques secondes' },
        { property: 'og:description', content: 'Pawly est le pommeau de douche conçu pour nettoyer les pattes de votre chien ou chat. Branchez-le et rincez en quelques secondes. Livraison gratuite.' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Pawly - Des pattes propres en quelques secondes' },
        { name: 'twitter:description', content: 'Pawly est le pommeau de douche conçu pour nettoyer les pattes de votre chien ou chat. Branchez-le et rincez en quelques secondes. Livraison gratuite.' },
        { name: 'theme-color', content: '#ffffff' },
      ],
      // Analytics scripts (Meta Pixel, GA4) are injected dynamically
      // via the useMetaPixel composable and storeConfig.analytics IDs.
      // Set NUXT_PUBLIC_META_PIXEL_ID env var or storeConfig.analytics values.
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
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
