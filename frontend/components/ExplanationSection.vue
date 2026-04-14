<template>
  <section id="explanation-section" class="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden bg-white">
    <div class="relative z-10 max-w-6xl mx-auto">
      <!-- Section header -->
      <div class="text-center mb-10 sm:mb-16 animate-on-scroll">
        <span class="inline-block text-accent-dark text-xs font-display font-semibold uppercase tracking-widest mb-4">Comment ça marche ?</span>
        <h2 class="font-display font-bold text-[22px] sm:text-[26px] lg:text-[32px] leading-[1.15] text-text mb-3">
          {{ storeConfig.explanation.title }}
        </h2>
        <p class="text-base sm:text-lg text-text-muted font-medium">
          regarde, tu as juste à
          <span class="relative inline-block mx-1">
            <span class="text-accent-dark font-display font-semibold border-2 border-dashed border-accent/50 rounded-xl px-3 py-1 sm:px-4 sm:py-1.5">Clip ton Bag</span>
          </span>
        </p>
      </div>

      <!-- Desktop: Video left + Steps right -->
      <div class="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">

        <!-- Video -->
        <div class="animate-on-scroll-scale relative">
          <div class="relative overflow-hidden rounded-lg">
            <div class="relative aspect-[4/5]">
              <video
                ref="videoRef"
                class="absolute inset-0 w-full h-full object-cover scale-150 rounded-lg"
                autoplay
                playsinline
                loop
                muted
                preload="auto"
              >
                <source :src="storeConfig.explanation.videoSrc" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>

        <!-- Steps -->
        <div class="mt-10 lg:mt-0">
          <div
            v-for="(feature, idx) in storeConfig.explanation.features"
            :key="idx"
            class="animate-on-scroll flex items-start gap-4"
            :class="idx < storeConfig.explanation.features.length - 1 ? 'mb-8' : ''"
          >
            <span class="shrink-0 w-12 h-12 rounded-full bg-accent/20 text-text border border-accent/30 flex items-center justify-center font-display font-bold text-lg">{{ idx + 1 }}</span>
            <div>
              <p class="text-text-muted text-sm leading-relaxed">{{ feature.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { storeConfig } from '~/config/store.config'

const videoRef = ref<HTMLVideoElement | null>(null)

onMounted(() => {
  if (videoRef.value) {
    videoRef.value.muted = true
    // Force play in case autoplay is blocked by the browser (iOS Safari, etc.)
    videoRef.value.play().catch(() => {})
  }
})
</script>
