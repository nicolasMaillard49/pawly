<template>
  <section id="testimonials-section" class="py-20 sm:py-28 px-4 sm:px-6 bg-surface-alt relative overflow-hidden">
    <div class="relative max-w-6xl mx-auto">
      <!-- Section header -->
      <div class="text-center mb-14 sm:mb-20 animate-on-scroll">
        <span class="inline-block text-accent-dark text-xs font-display font-semibold uppercase tracking-widest mb-4">Témoignages</span>
        <h2 class="font-display font-bold text-[22px] sm:text-[26px] lg:text-[32px] leading-[1.15] text-text mb-4">
          Ce que disent <span class="text-accent-dark">nos clients</span>
        </h2>

        <!-- Overall rating summary -->
        <div class="flex items-center justify-center gap-4 mt-6">
          <div class="flex items-center gap-1">
            <svg v-for="star in 4" :key="star" class="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <svg class="w-6 h-6" viewBox="0 0 20 20">
              <defs><linearGradient id="half-testi"><stop offset="50%" stop-color="#FACC15" /><stop offset="50%" stop-color="#D1D5DB" /></linearGradient></defs>
              <path fill="url(#half-testi)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <div class="text-left">
            <span class="text-text font-display font-bold text-lg">4.5/5</span>
            <span class="text-text-muted text-sm ml-1">basé sur 172 avis</span>
          </div>
        </div>
      </div>

      <!-- Carousel -->
      <div class="relative">
        <!-- Arrow left -->
        <button
          class="absolute left-0 sm:-left-5 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border border-border text-text-muted hover:text-accent-dark hover:border-accent/30 hover:bg-surface-alt transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/50"
          aria-label="Avis précédent"
          @click="navigate(-1)"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Arrow right -->
        <button
          class="absolute right-0 sm:-right-5 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border border-border text-text-muted hover:text-accent-dark hover:border-accent/30 hover:bg-surface-alt transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/50"
          aria-label="Avis suivant"
          @click="navigate(1)"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- 3D Stage -->
        <div
          ref="stageRef"
          class="review-stage relative mx-8 sm:mx-14"
          @touchstart.passive="onTouchStart"
          @touchmove.passive="onTouchMove"
          @touchend="onTouchEnd"
          @keydown.left="navigate(-1)"
          @keydown.right="navigate(1)"
          tabindex="0"
          role="region"
          aria-label="Carrousel d'avis clients"
          aria-roledescription="carousel"
        >
          <div
            v-for="(testimonial, idx) in testimonials"
            :key="idx"
            class="review-card"
            :class="{ 'review-card--active': idx === current }"
            :style="cardStyle(idx)"
            :aria-hidden="idx !== current"
            @click="onCardClick(idx)"
          >
            <!-- Card content -->
            <div class="relative h-full flex flex-col p-5 sm:p-6">
              <!-- Stars -->
              <div class="flex items-center gap-0.5 mb-4">
                <svg v-for="star in 5" :key="star" class="w-4 h-4 text-yellow-400 star-pulse" :style="{ animationDelay: `${star * 0.1}s` }" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>

              <!-- Quote -->
              <blockquote class="text-text-muted text-sm leading-relaxed flex-1 mb-5">
                "{{ testimonial.quote }}"
              </blockquote>

              <!-- Author -->
              <div class="flex items-center gap-3 pt-4 border-t border-border">
                <div class="flex items-center justify-center w-9 h-9 rounded-full bg-accent/10 text-accent-dark font-display font-bold text-xs ring-2 ring-accent/20">
                  {{ testimonial.initials }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-text font-display font-semibold text-sm">{{ testimonial.name }}</p>
                  <p class="text-text-muted text-xs">{{ testimonial.sport }}</p>
                </div>
                <div class="flex items-center gap-1 bg-accent/10 rounded-full px-2 py-0.5">
                  <svg class="w-3 h-3 text-accent-dark" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-[10px] text-accent-dark font-display font-semibold">Vérifié</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Dots -->
        <div class="flex items-center justify-center gap-1.5 mt-6 sm:mt-8" role="tablist" aria-label="Navigation avis">
          <button
            v-for="(_, idx) in testimonials"
            :key="idx"
            class="review-dot"
            :class="idx === current ? 'review-dot--active' : ''"
            role="tab"
            :aria-selected="idx === current"
            :aria-label="`Avis ${idx + 1}`"
            @click="current = idx; startAutoplay()"
          />
        </div>
      </div>

      <!-- Social card -->
      <div id="social-section" class="max-w-md mx-auto mt-12 sm:mt-16 mb-4 py-6 sm:py-8 px-5 sm:px-8 bg-surface-alt border border-border rounded-2xl shadow-lg text-center">
        <span class="inline-block text-accent-dark text-xs font-display font-semibold uppercase tracking-widest mb-3">Social</span>
        <h3 class="font-display font-bold text-[20px] sm:text-[24px] leading-[1.15] text-text mb-3">
          Vu sur les <span class="text-accent-dark">Réseaux Sociaux</span>
        </h3>
        <p class="text-text-muted text-base max-w-sm mx-auto mb-6">
          Aperçu sur toutes les plateformes.
        </p>

        <!-- Platform badges -->
        <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <a
            v-for="platform in platforms"
            :key="platform.name"
            :href="platform.url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-white border border-border rounded-full px-3 py-1.5 sm:px-4 sm:py-2 hover:border-accent/30 hover:bg-accent/5 transition-all duration-300 cursor-pointer group"
          >
            <component :is="platform.icon" />
            <span class="text-xs sm:text-sm font-medium text-text-muted group-hover:text-text transition-colors duration-300 whitespace-nowrap">{{ platform.name }}</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { storeConfig } from '~/config/store.config'

const InstagramIcon = () =>
  h('svg', { class: 'w-5 h-5 text-pink-500', fill: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' }),
  ])

const TikTokIcon = () =>
  h('svg', { class: 'w-5 h-5 text-text', fill: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { d: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' }),
  ])

const YouTubeIcon = () =>
  h('svg', { class: 'w-5 h-5 text-red-500', fill: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { d: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' }),
  ])

const FacebookIcon = () =>
  h('svg', { class: 'w-5 h-5 text-blue-500', fill: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { d: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' }),
  ])

const TwitterIcon = () =>
  h('svg', { class: 'w-5 h-5 text-text', fill: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' }),
  ])

const platforms = [
  { name: 'Instagram', icon: InstagramIcon, url: 'https://www.instagram.com/' },
  { name: 'TikTok', icon: TikTokIcon, url: 'https://www.tiktok.com/' },
  { name: 'YouTube', icon: YouTubeIcon, url: 'https://www.youtube.com/' },
  { name: 'Facebook', icon: FacebookIcon, url: 'https://www.facebook.com/' },
  { name: 'X', icon: TwitterIcon, url: 'https://x.com/' },
]

const stageRef = ref<HTMLElement | null>(null)
const current = ref(0)

// ---- Auto-play ----
let autoplayTimer: ReturnType<typeof setInterval> | null = null

const startAutoplay = () => {
  stopAutoplay()
  autoplayTimer = setInterval(() => navigate(1), 4000)
}

const stopAutoplay = () => {
  if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null }
}

onMounted(() => startAutoplay())
onUnmounted(() => stopAutoplay())

// ---- Navigation ----
const navigate = (dir: number) => {
  const len = testimonials.length
  if (!len) return
  current.value = (current.value + dir + len) % len
  startAutoplay()
}

// ---- Touch / Swipe ----
let tx0 = 0
let dx = 0

const onTouchStart = (e: TouchEvent) => { tx0 = e.touches[0].clientX; dx = 0 }
const onTouchMove = (e: TouchEvent) => { dx = e.touches[0].clientX - tx0 }
const onTouchEnd = () => {
  if (Math.abs(dx) > 40) navigate(dx < 0 ? 1 : -1)
  dx = 0
}

// ---- Card click ----
const onCardClick = (idx: number) => {
  if (idx !== current.value) { current.value = idx; startAutoplay() }
}

// ---- 3D positioning (infinite wrap-around) — same algo as SocialVideoSection ----
const cardStyle = (idx: number) => {
  const len = testimonials.length
  if (!len) return { opacity: 0, pointerEvents: 'none' as const, transform: 'scale(0)' }

  let diff = idx - current.value
  if (diff > len / 2) diff -= len
  if (diff < -len / 2) diff += len

  const abs = Math.abs(diff)

  if (abs > 3) return { opacity: 0, pointerEvents: 'none' as const, transform: 'scale(0)' }

  const tx = diff * 58
  const tz = -abs * 80
  const ry = diff * -8
  const s = abs === 0 ? 1 : Math.max(0.7, 1 - abs * 0.12)
  const o = abs === 0 ? 1 : Math.max(0, 1 - abs * 0.3)

  return {
    transform: `translateX(${tx}%) translateZ(${tz}px) rotateY(${ry}deg) scale(${s})`,
    opacity: o,
    zIndex: 20 - abs,
    pointerEvents: abs > 2 ? 'none' as const : 'auto' as const,
    filter: abs > 0 ? `brightness(${0.92 + (1 - abs * 0.15) * 0.08})` : 'none',
  }
}

const testimonials = storeConfig.reviews.map((r) => {
  const parts = r.name.split(' ')
  const initials = parts.map(p => p[0]?.toUpperCase() || '').join('')
  return {
    name: r.name,
    initials,
    sport: r.sport,
    quote: r.text,
  }
})
</script>

<style scoped>
/* ---- Stage: 3D perspective container ---- */
.review-stage {
  perspective: 1000px;
  perspective-origin: 50% 50%;
  height: 260px;
  position: relative;
  outline: none;
}

/* ---- Card: absolutely centered, 3D-transformed ---- */
.review-card {
  position: absolute;
  top: 0;
  left: 50%;
  width: clamp(260px, 70vw, 320px);
  height: 260px;
  margin-left: calc(clamp(260px, 70vw, 320px) / -2);
  border-radius: 1rem;
  overflow: hidden;
  transform-style: preserve-3d;
  transition:
    transform 0.55s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1),
    filter 0.55s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
  cursor: pointer;
  background: #fff;
  border: 1px solid rgba(16, 16, 16, 0.12);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

/* ---- Active card ---- */
.review-card--active {
  background: #fff;
  border-color: rgba(16, 16, 16, 0.12);
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.06),
    0 1px 3px rgba(0, 0, 0, 0.04);
}

/* ---- Dots ---- */
.review-dot {
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: rgba(16, 16, 16, 0.15);
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.review-dot:hover {
  background: rgba(16, 16, 16, 0.35);
}

.review-dot--active {
  width: 28px;
  background: var(--color-accent, #9BCBEB);
  box-shadow: 0 0 12px rgba(155, 203, 235, 0.5);
}

/* ---- Desktop: larger cards ---- */
@media (min-width: 640px) {
  .review-stage {
    height: 280px;
  }

  .review-card {
    width: clamp(340px, 32vw, 440px);
    height: 280px;
    margin-left: calc(clamp(340px, 32vw, 440px) / -2);
    border-radius: 1rem;
  }

  .review-dot--active {
    width: 32px;
  }
}

/* ---- Star pulse on active card ---- */
.review-card--active .star-pulse {
  animation: star-pulse 2s ease-in-out infinite;
}

@keyframes star-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); filter: drop-shadow(0 0 4px rgba(250, 204, 21, 0.6)); }
}

/* ---- Reduced motion ---- */
@media (prefers-reduced-motion: reduce) {
  .review-card,
  .review-dot,
  .star-pulse {
    transition: none;
    animation: none;
  }
}
</style>
