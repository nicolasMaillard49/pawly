<template>
  <div>
    <HeroSection />
    <ProblemSection />
    <ExplanationSection />
    <TestimonialsSection />
    <FaqSection />

    <!-- Floating mobile CTA -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-full opacity-0"
    >
      <button
        v-if="showFloatingCta"
        class="fixed bottom-6 left-4 right-4 z-40 sm:hidden bg-text hover:bg-text/90 active:scale-[0.98] text-white font-sans font-semibold text-base py-3 px-8 rounded-pill cursor-pointer transition-colors duration-150 ease-in-out flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
        @click="scrollToOrder"
      >
        AJOUTER AU PANIER
      </button>
    </Transition>

    <!-- Purchase notification toast -->
    <PurchaseNotification />
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'ClipBag - Le Sac Magnétique pour Bouteille | Libérez Vos Mains',
  ogTitle: 'ClipBag - Le Sac Magnétique pour Bouteille',
  description: 'Le sac magnétique révolutionnaire pour vos bouteilles d\'eau. Fixation instantanée, ultra léger (120g), compatible toutes bouteilles. Livraison gratuite. -40% en ce moment.',
  ogDescription: 'Plus jamais les mains encombrées pendant le sport. Découvrez le sac magnétique ClipBag - Fixation instantanée, 120g seulement. 29,99 EUR au lieu de 49,99 EUR.',
  ogImage: 'https://clipbag.shop/og.png',
  ogType: 'website',
  ogLocale: 'fr_FR',
  twitterCard: 'summary_large_image',
})

useHead({
  htmlAttrs: {
    lang: 'fr',
    class: 'scroll-smooth',
  },
  link: [{ rel: 'canonical', href: 'https://clipbag.shop' }],
})

const productStore = useProductStore()
const { track: fbTrack } = useMetaPixel()

await useAsyncData(
  'product-and-bundles',
  async () => {
    await Promise.all([productStore.fetchProduct(), productStore.fetchBundles()])
    return { ok: true }
  },
  {
    // Force a refetch if the Pinia store is empty (e.g. returning from
    // Stripe checkout through a fresh /cancel page load).
    getCachedData: () =>
      productStore.product && productStore.bundles.length ? { ok: true } : undefined,
  }
)

onMounted(async () => {
  const p = productStore.product
  if (p) {
    fbTrack('ViewContent', {
      content_name: p.name,
      content_ids: [p.id],
      content_type: 'product',
      value: p.price,
      currency: 'EUR',
    })
  }
})

const showFloatingCta = ref(false)

const scrollToOrder = () => {
  const el = document.getElementById('order-section') || document.getElementById('hero-section')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  const handleScroll = () => {
    const hero = document.getElementById('hero-section')
    if (!hero) return
    const heroBottom = hero.getBoundingClientRect().bottom
    showFloatingCta.value = heroBottom < 0
  }

  window.addEventListener('scroll', handleScroll, { passive: true })

  const animatedElements = document.querySelectorAll(
    '.animate-on-scroll, .animate-on-scroll-left, .animate-on-scroll-right, .animate-on-scroll-scale'
  )

  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    animatedElements.forEach((el) => observer.observe(el))
  }
})
</script>
