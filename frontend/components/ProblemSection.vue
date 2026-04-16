<template>
  <section id="problem-section" class="problem-section" aria-label="Problèmes et solutions">
    <div class="problem-inner">
      <!-- Section header -->
      <div class="problem-header">
        <div class="header-label">
          <div class="header-label__line"></div>
          <span>Solution</span>
        </div>
        <h2 class="header-title">
          Arrêtez de
          <s class="header-title__strike" aria-label="galérer, barré">galérer</s>,<br>
          branchez
          <span class="header-title__accent">Pawly</span>.
        </h2>
      </div>

      <!-- ===== Mobile / Tablet: horizontal carousel ===== -->
      <div class="carousel" role="region" :aria-label="`Fonctionnalités ${storeConfig.storeName}`">
        <div
          v-for="(item, idx) in items"
          :key="'m-' + idx"
          class="carousel__card"
        >
          <img :src="item.image" :alt="item.alt" class="carousel__img" loading="lazy" />
          <div class="card-body">
            <span class="counter">{{ String(idx + 1).padStart(2, '0') }}</span>
            <p class="card-problem">{{ item.problem }}</p>
            <p class="card-pain">{{ item.pain }}</p>
            <p class="card-solution">{{ item.solution }}</p>
          </div>
        </div>
      </div>

      <!-- ===== Desktop: grid + sticky image (page scroll) ===== -->
      <div class="panel">
        <!-- Left: text items stacked vertically -->
        <div class="panel__content">
          <div
            v-for="(item, idx) in items"
            :key="'d-' + idx"
            :data-idx="idx"
            role="tab"
            tabindex="0"
            :aria-selected="activeIndex === idx"
            class="panel__item"
            :class="{ 'is-active': activeIndex === idx }"
            @click="goTo(idx)"
            @keydown.enter="goTo(idx)"
            @keydown.space.prevent="goTo(idx)"
          >
            <div class="panel__item-indicator"></div>
            <div class="panel__item-body">
              <span class="counter">{{ String(idx + 1).padStart(2, '0') }}</span>
              <p class="card-problem card-problem--lg">{{ item.problem }}</p>
              <p class="card-pain">{{ item.pain }}</p>
              <p class="card-solution">{{ item.solution }}</p>
            </div>
          </div>
        </div>

        <!-- Right: sticky image that changes on scroll -->
        <div class="panel__media" role="tabpanel">
          <img
            v-for="(item, idx) in items"
            :key="'img-' + idx"
            :src="item.image"
            :alt="item.alt"
            class="panel__img"
            :class="{ 'is-active': activeIndex === idx }"
            loading="lazy"
          />
        </div>
      </div>

      <!-- Bottom CTA -->
      <div class="cta">
        <button type="button" class="cta__btn" @click="scrollToOrder">
          Découvrir {{ storeConfig.storeName }}
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <span class="cta__sub">4 problèmes. 1 solution.</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { storeConfig } from '~/config/store.config'

const items = storeConfig.problems.map((p) => ({
  problem: p.pain,
  pain: p.pain,
  solution: p.solution,
  image: p.image,
  alt: p.alt,
}))

const activeIndex = ref(0)
let observer: IntersectionObserver | null = null

const goTo = (idx: number) => {
  const el = document.querySelectorAll('#problem-section .panel__item')[idx] as HTMLElement
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

onMounted(async () => {
  await nextTick()

  // Observe items in the VIEWPORT (page scroll, not internal scroll)
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = Number(entry.target.getAttribute('data-idx'))
          if (!isNaN(idx)) activeIndex.value = idx
        }
      })
    },
    {
      // No root = viewport
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0,
    }
  )

  document.querySelectorAll('#problem-section .panel__item').forEach((el) => {
    observer?.observe(el)
  })
})

onUnmounted(() => {
  observer?.disconnect()
})

const scrollToOrder = () => {
  const el = document.getElementById('order-section')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
/* ==============================
   Section
   ============================== */
.problem-section {
  background: #f5f5f5;
  position: relative;
}

.problem-inner {
  max-width: 1190px;
  margin: 0 auto;
  padding: 3rem 1.25rem;
}
@media (min-width: 640px) {
  .problem-inner { padding: 3.5rem 2rem; }
}
@media (min-width: 1024px) {
  .problem-inner { padding: 4rem 2.5rem; }
}

/* ==============================
   Header
   ============================== */
.problem-header {
  margin-bottom: 1.75rem;
}
@media (min-width: 640px) {
  .problem-header { margin-bottom: 2.25rem; }
}

.header-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.625rem;
}

.header-label__line {
  width: 1.5rem;
  height: 1px;
  background: #5A9AC2;
}

.header-label span {
  font-family: Inconsolata, monospace;
  font-weight: 600;
  font-size: 0.6875rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #5A9AC2;
}

.header-title {
  font-family: Inconsolata, monospace;
  font-weight: 700;
  font-size: 1.5rem;
  line-height: 1.08;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  color: #101010;
  max-width: 36rem;
}
@media (min-width: 640px) { .header-title { font-size: 2rem; } }
@media (min-width: 1024px) { .header-title { font-size: 2.25rem; } }

.header-title__strike {
  text-decoration: none;
  color: #d43a35;
  position: relative;
  display: inline-block;
}
.header-title__strike::after {
  content: '';
  position: absolute;
  left: 0;
  top: 55%;
  width: 100%;
  height: 2px;
  background: #d43a35;
  border-radius: 1px;
}

.header-title__accent { color: #5A9AC2; }

/* ==============================
   Shared type
   ============================== */
.counter {
  font-family: Inconsolata, monospace;
  font-weight: 700;
  font-size: 0.6875rem;
  line-height: 1;
  color: rgba(16, 16, 16, 0.2);
  letter-spacing: 0.04em;
}

.card-problem {
  font-family: Inconsolata, monospace;
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: #101010;
  margin: 0;
}
.card-problem--lg { font-size: 1.125rem; }
@media (min-width: 1280px) { .card-problem--lg { font-size: 1.25rem; } }

.card-pain {
  font-family: Inconsolata, monospace;
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 1.5;
  color: rgba(16, 16, 16, 0.4);
  margin: 0;
}

.card-solution {
  font-family: Inconsolata, monospace;
  font-weight: 500;
  font-size: 0.75rem;
  line-height: 1.5;
  color: rgba(16, 16, 16, 0.55);
  margin: 0;
}

@media (min-width: 1024px) {
  .card-pain { font-size: 0.8125rem; }
  .card-solution { font-size: 0.8125rem; }
}

/* ==============================
   Mobile / Tablet carousel
   ============================== */
.carousel {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scroll-padding-left: 1.25rem;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;
  margin-left: -1.25rem;
  margin-right: -1.25rem;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
  padding-bottom: 0.5rem;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.carousel::-webkit-scrollbar { display: none; }

@media (min-width: 640px) {
  .carousel {
    scroll-padding-left: 2rem;
    margin-left: -2rem;
    margin-right: -2rem;
    padding-left: 2rem;
    padding-right: 2rem;
    gap: 1.25rem;
  }
}
@media (min-width: 1024px) {
  .carousel { display: none; }
}

.carousel__card {
  flex: 0 0 68vw;
  max-width: 280px;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}
@media (min-width: 640px) {
  .carousel__card {
    flex: 0 0 45vw;
    max-width: 300px;
  }
}

.carousel__img {
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  border-radius: 0.375rem;
  display: block;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-top: 0.75rem;
}

.card-body .card-solution {
  margin-top: 0.25rem;
}

/* ==============================
   Desktop: CSS Grid + sticky image
   Page scroll drives everything.
   ============================== */
.panel {
  display: none;
}

@media (min-width: 1024px) {
  .panel {
    display: grid;
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1fr);
    column-gap: 2.5rem;
    align-items: start;
  }
}

/* --- Left column: text items --- */
.panel__content {
  display: flex;
  flex-direction: column;
}

.panel__item {
  display: flex;
  align-items: stretch;
  min-height: 55vh;
  cursor: pointer;
  position: relative;
  transition: opacity 0.4s ease;
  opacity: 0.18;
}

.panel__item:last-child {
  min-height: 40vh;
}

.panel__item:focus-visible {
  outline: 2px solid #9BCBEB;
  outline-offset: -2px;
  border-radius: 0.25rem;
}

.panel__item.is-active {
  opacity: 1;
}

/* Accent bar */
.panel__item-indicator {
  width: 2px;
  flex-shrink: 0;
  border-radius: 1px;
  background: transparent;
  transition: background 0.4s ease;
}

.panel__item.is-active .panel__item-indicator {
  background: #9BCBEB;
}

.panel__item-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.35rem;
  padding-left: 1.25rem;
  padding-right: 0.5rem;
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.panel__item-body .card-solution {
  margin-top: 0.15rem;
}

/* --- Right column: sticky image --- */
.panel__media {
  position: sticky;
  top: 5.5rem;
  height: calc(100vh - 7rem);
  max-height: 36rem;
  border-radius: 0.375rem;
  overflow: hidden;
  background: #eaeaea;
}

.panel__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transform: scale(1.04);
  transition:
    opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.panel__img.is-active {
  opacity: 1;
  transform: scale(1);
}

/* ==============================
   CTA
   ============================== */
.cta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  margin-top: 2rem;
}
@media (min-width: 640px) {
  .cta {
    flex-direction: row;
    align-items: center;
    margin-top: 2.5rem;
  }
}

.cta__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #9BCBEB;
  color: #ffffff;
  font-family: Inconsolata, monospace;
  font-weight: 700;
  font-size: 0.8125rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.7rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  box-shadow: 0 3px 14px rgba(155, 203, 235, 0.35);
}
.cta__btn:hover { background: #7FB3D9; }
.cta__btn:active { transform: scale(0.97); }
.cta__btn:focus-visible {
  outline: 2px solid #5A9AC2;
  outline-offset: 2px;
}
@media (min-width: 640px) {
  .cta__btn {
    font-size: 0.875rem;
    padding: 0.75rem 1.875rem;
  }
}

.cta__sub {
  font-family: Inconsolata, monospace;
  font-weight: 400;
  font-size: 0.6875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(16, 16, 16, 0.35);
}

/* ==============================
   Reduced motion
   ============================== */
@media (prefers-reduced-motion: reduce) {
  .panel__img,
  .panel__item,
  .panel__item-indicator {
    transition: none;
  }
}
</style>
