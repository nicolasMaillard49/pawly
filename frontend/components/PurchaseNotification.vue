<template>
  <Transition
    enter-active-class="transition-all duration-500 ease-out"
    enter-from-class="-translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="-translate-y-full opacity-0"
  >
    <div
      v-if="visible"
      class="fixed top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-auto z-50 bg-white border border-border rounded-2xl shadow-card px-4 py-3.5 sm:px-5 sm:py-4 flex items-center gap-3 sm:max-w-sm"
    >
      <!-- Accent bar left -->
      <div class="absolute left-0 top-3 bottom-3 w-1 rounded-full bg-accent"></div>

      <!-- Avatar icon -->
      <div class="shrink-0 w-10 h-10 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center">
        <span class="text-lg">🛒</span>
      </div>

      <!-- Text -->
      <div class="flex-1 min-w-0">
        <p class="text-sm text-text font-display font-semibold leading-tight truncate">
          {{ currentName }} de {{ currentCity }}
        </p>
        <p class="text-xs text-text-muted mt-0.5">
          A commandé un ClipBag · <span class="text-accent-dark font-medium">il y a {{ currentMinutes }} min</span>
        </p>
      </div>

      <!-- Close -->
      <button
        class="shrink-0 text-text-muted/50 hover:text-text-muted transition-colors cursor-pointer p-1"
        aria-label="Fermer"
        @click="dismiss"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const names = [
  'Thomas', 'Lucas', 'Hugo', 'Léo', 'Nathan', 'Louis', 'Jules', 'Gabriel',
  'Arthur', 'Raphaël', 'Mathis', 'Ethan', 'Noah', 'Maxime', 'Alexandre',
  'Antoine', 'Clément', 'Théo', 'Romain', 'Baptiste', 'Emma', 'Jade',
  'Louise', 'Chloé', 'Manon', 'Camille', 'Sarah', 'Léa', 'Julie', 'Marie',
]

const cities = [
  'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux', 'Lille', 'Nantes',
  'Strasbourg', 'Montpellier', 'Rennes', 'Nice', 'Grenoble', 'Rouen',
  'Toulon', 'Dijon', 'Angers', 'Reims', 'Brest', 'Metz', 'Clermont-Ferrand',
]

const SHOW_DURATION = 6000
const ROTATION_INTERVAL = 25_000

const visible = ref(false)
const currentName = ref('')
const currentCity = ref('')
const currentMinutes = ref(1)

let rotationTimer: ReturnType<typeof setInterval> | null = null
let dismissTimer: ReturnType<typeof setTimeout> | null = null

const pickRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

const generateNotification = () => {
  currentName.value = pickRandom(names)
  currentCity.value = pickRandom(cities)
  currentMinutes.value = Math.floor(Math.random() * 15) + 1
}

const autoDismiss = () => {
  if (dismissTimer) clearTimeout(dismissTimer)
  dismissTimer = setTimeout(() => { visible.value = false }, SHOW_DURATION)
}

const showNext = () => {
  visible.value = false
  setTimeout(() => {
    generateNotification()
    visible.value = true
    autoDismiss()
  }, 500)
}

const dismiss = () => {
  visible.value = false
  if (dismissTimer) { clearTimeout(dismissTimer); dismissTimer = null }
}

onMounted(() => {
  // First notification after 4s delay
  setTimeout(() => {
    generateNotification()
    visible.value = true
    autoDismiss()
  }, 4000)

  rotationTimer = setInterval(showNext, ROTATION_INTERVAL)
})

onUnmounted(() => {
  if (rotationTimer) clearInterval(rotationTimer)
  if (dismissTimer) clearTimeout(dismissTimer)
})
</script>