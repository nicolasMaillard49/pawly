<template>
  <nav
    ref="navRef"
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled
        ? 'bg-white/80 backdrop-blur-lg border-b border-border shadow-subtle'
        : 'bg-transparent',
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 sm:h-18">
        <!-- Logo -->
        <NuxtLink
          to="/"
          class="text-text font-display font-bold text-xl sm:text-2xl uppercase tracking-wider cursor-pointer select-none transition-colors duration-200 hover:text-text/70"
        >
          {{ storeConfig.storeName }}
        </NuxtLink>

        <!-- Desktop nav links -->
        <div class="hidden md:flex items-center gap-1">
          <template v-for="link in navLinks" :key="link.href">
            <NuxtLink
              v-if="link.isPage"
              :to="link.href"
              :class="[
                'px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer rounded-lg',
                link.highlight
                  ? 'text-accent hover:text-accent-hover'
                  : 'text-text-muted hover:text-text'
              ]"
            >
              {{ link.label }}
            </NuxtLink>
            <a
              v-else
              :href="link.href"
              :class="[
                'relative px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer rounded-lg hover:bg-surface-alt',
                activeSection === link.href.replace('#', '')
                  ? 'text-text'
                  : 'text-text-muted hover:text-text'
              ]"
              @click.prevent="scrollToSection(link.href)"
            >
              {{ link.label }}
              <span
                v-if="activeSection === link.href.replace('#', '')"
                class="absolute bottom-0.5 left-4 right-4 h-0.5 rounded-full bg-accent"
              ></span>
            </a>
          </template>
        </div>

        <!-- Desktop CTA -->
        <button
          class="hidden md:inline-flex items-center bg-accent text-white py-3 px-7 rounded-pill font-sans font-semibold text-base cursor-pointer transition-colors duration-150 ease-in-out focus:outline-none hover:bg-accent-hover"
          @click="scrollToSection('#order-section')"
        >
          AJOUTER AU PANIER
        </button>

        <!-- Mobile hamburger -->
        <button
          class="md:hidden flex items-center justify-center w-11 h-11 rounded-xl text-text-muted hover:text-text hover:bg-surface-alt transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
          :aria-expanded="mobileOpen"
          aria-label="Menu de navigation"
          @click.stop="mobileOpen = !mobileOpen"
        >
          <svg
            v-if="!mobileOpen"
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg
            v-else
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu slide-in -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-96"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 max-h-96"
      leave-to-class="opacity-0 max-h-0"
    >
      <div
        v-if="mobileOpen"
        class="md:hidden overflow-hidden border-t border-border bg-white"
      >
        <div class="px-4 py-4 space-y-1">
          <template v-for="link in navLinks" :key="link.href">
            <NuxtLink
              v-if="link.isPage"
              :to="link.href"
              :class="[
                'flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl transition-colors duration-200 cursor-pointer',
                link.highlight
                  ? 'text-accent hover:text-accent-hover'
                  : 'text-text-muted hover:text-text hover:bg-surface-alt'
              ]"
              @click="mobileOpen = false"
            >
              {{ link.label }}
            </NuxtLink>
            <a
              v-else
              :href="link.href"
              class="flex items-center gap-3 px-4 py-3 text-base font-medium text-text-muted hover:text-text hover:bg-surface-alt rounded-xl transition-colors duration-200 cursor-pointer"
              @click.prevent="scrollToSection(link.href); mobileOpen = false"
            >
              {{ link.label }}
            </a>
          </template>
          <div class="pt-2">
            <button
              class="w-full bg-accent hover:bg-accent-hover text-white font-sans font-semibold text-base py-4 px-8 rounded-pill cursor-pointer transition-colors duration-150 ease-in-out focus:outline-none flex items-center justify-center"
              @click="scrollToSection('#order-section'); mobileOpen = false"
            >
              AJOUTER AU PANIER
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { storeConfig } from '~/config/store.config'

const navRef = ref<HTMLElement | null>(null)
const scrolled = ref(false)
const mobileOpen = ref(false)

const onClickOutside = (e: MouseEvent) => {
  if (mobileOpen.value && navRef.value && !navRef.value.contains(e.target as Node)) {
    mobileOpen.value = false
  }
}
const activeSection = ref('')

const sectionIds = ['hero-section', 'problem-section', 'explanation-section', 'testimonials-section', 'faq-section']

const navLinks = [
  { label: 'Accueil', href: '#hero-section' },
  { label: 'Solution', href: '#problem-section' },
  { label: 'Comment ça marche', href: '#explanation-section' },
  { label: 'Avis', href: '#testimonials-section' },
  { label: 'FAQ', href: '#faq-section' },
  { label: 'Suivre ma commande', href: '/suivi', isPage: true, highlight: true },
]

const handleScroll = () => {
  scrolled.value = window.scrollY > 40
}

const route = useRoute()

const scrollToSection = (href: string) => {
  const id = href.replace('#', '')
  // If we're not on the homepage, navigate there with the anchor
  if (route.path !== '/') {
    navigateTo(`/${href}`)
    return
  }
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

let sectionObserver: IntersectionObserver | null = null

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('click', onClickOutside)
  handleScroll()

  // Observe sections to highlight active nav link
  sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      })
    },
    { rootMargin: '-40% 0px -55% 0px' }
  )

  sectionIds.forEach((id) => {
    const el = document.getElementById(id)
    if (el) sectionObserver!.observe(el)
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', onClickOutside)
  if (sectionObserver) sectionObserver.disconnect()
})
</script>
