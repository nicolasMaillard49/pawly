export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxtjs/sitemap'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000/api',
      siteUrl: 'https://clipbag.shop',
      metaPixelId: '2478874479214730',
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      title: 'ClipBag - Sac Magnétique pour Bouteille | Livraison Gratuite',
      meta: [
        { name: 'description', content: 'Le sac magnétique révolutionnaire pour vos bouteilles. Fixation instantanée, ultra léger (120g), compatible toutes bouteilles. -40% : 29,99€ au lieu de 49,99€. Livraison gratuite en France.' },
        { name: 'keywords', content: 'clipbag, sac magnétique bouteille, porte bouteille sport, accessoire sport, porte gourde magnétique' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'fr_FR' },
        { property: 'og:site_name', content: 'ClipBag' },
        { property: 'og:title', content: 'ClipBag - Le Sac Magnétique pour Bouteille' },
        { property: 'og:description', content: 'Libérez vos mains pendant le sport. Fixation magnétique instantanée, ultra léger. -40% : 29,99€.' },
        { property: 'og:image', content: 'https://clipbag.shop/og.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'ClipBag - Le Sac Magnétique pour Bouteille' },
        { name: 'twitter:description', content: 'Libérez vos mains pendant le sport. -40% : 29,99€. Livraison gratuite.' },
        { name: 'theme-color', content: '#ffffff' },
        { name: 'google-site-verification', content: 'a20ya7ig--nHqsLOgvsGWQUFYM0Dpj4d5EKT2s8wWdo' },
      ],
      script: [
        {
          innerHTML: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','2478874479214730');fbq('track','PageView');`,
        },
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=G-9ZMB9JPKLM',
          async: true,
        },
        {
          innerHTML: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-9ZMB9JPKLM');`,
        },
      ],
      noscript: [
        {
          innerHTML: '<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=2478874479214730&ev=PageView&noscript=1" />',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Barlow:wght@300;400;500;600;700;800&display=swap' },
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
    siteUrl: 'https://clipbag.shop',
    exclude: ['/admin/**', '/success', '/cancel'],
  },
  devServer: {
    port: 4000,
    host: '0.0.0.0',
  },
  nitro: {
    compressPublicAssets: true,
  },
})
