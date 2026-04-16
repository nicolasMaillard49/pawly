<template>
  <section id="faq-section" class="py-20 sm:py-28 px-4 sm:px-6 bg-white relative overflow-hidden">
    <!-- Paw prints background trail -->
    <img src="/images/logo_black.png" alt="" aria-hidden="true" class="absolute top-20 right-[6%] w-10 h-10 sm:w-14 sm:h-14 opacity-[0.06] rotate-[25deg] pointer-events-none select-none" />
    <img src="/images/logo_black.png" alt="" aria-hidden="true" class="absolute bottom-24 left-[4%] w-8 h-8 sm:w-12 sm:h-12 opacity-[0.06] -rotate-[15deg] pointer-events-none select-none hidden sm:block" />

    <div class="relative max-w-3xl mx-auto">
      <!-- Section header -->
      <div class="text-center mb-16 animate-on-scroll">
        <span class="inline-block text-accent-dark text-xs font-display font-semibold uppercase tracking-widest mb-4">FAQ</span>
        <h2 class="font-display font-bold text-[22px] sm:text-[26px] lg:text-[32px] leading-[1.15] text-text mb-4">
          Questions <span class="text-accent-dark">fréquentes</span>
        </h2>
        <p class="text-text-muted text-lg max-w-2xl mx-auto">
          Tout ce que vous devez savoir avant de commander.
        </p>
      </div>

      <div class="space-y-3 animate-on-scroll">
        <div
          v-for="(item, idx) in faqs"
          :key="idx"
          :class="[
            'rounded-2xl overflow-hidden transition-all duration-300 border',
            openIndex === idx
              ? 'bg-surface-alt border-accent/30 shadow-subtle'
              : 'bg-surface-alt border-border hover:border-border',
          ]"
        >
          <button
            class="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-inset"
            :aria-expanded="openIndex === idx"
            @click="toggle(idx)"
          >
            <span :class="[
              'font-display font-semibold text-base sm:text-lg transition-colors duration-200',
              openIndex === idx ? 'text-accent-dark' : 'text-text',
            ]">
              {{ item.question }}
            </span>
            <span :class="[
              'flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300',
              openIndex === idx ? 'bg-accent/10 text-accent-dark rotate-180' : 'bg-surface-alt text-text-muted',
            ]">
              <svg
                class="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>

          <div
            :class="[
              'grid transition-all duration-300 ease-in-out',
              openIndex === idx ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
            ]"
          >
            <div class="overflow-hidden">
              <p class="px-6 pb-6 text-text-muted leading-relaxed text-base">
                {{ item.answer }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom CTA -->
      <div class="mt-12 text-center animate-on-scroll">
        <div class="bg-surface-alt border border-border rounded-3xl p-8 sm:p-10">
          <h3 class="font-display font-bold text-lg sm:text-xl text-text mb-2">
            Vous avez d'autres questions ?
          </h3>
          <p class="text-text-muted text-base mb-6">
            Notre équipe est là pour vous aider. N'hésitez pas à nous contacter.
          </p>
          <a
            :href="`mailto:${storeConfig.contactEmail}`"
            class="inline-flex items-center gap-2 bg-white border border-border hover:border-accent/30 text-text font-display font-semibold py-3 px-6 rounded-xl transition-all duration-200 cursor-pointer hover:bg-surface-alt group"
          >
            <svg class="w-5 h-5 text-accent-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {{ storeConfig.contactEmail }}
            <svg class="w-4 h-4 text-text-muted group-hover:text-accent-dark transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { storeConfig } from '~/config/store.config'

const openIndex = ref<number | null>(null)

const toggle = (idx: number) => {
  openIndex.value = openIndex.value === idx ? null : idx
}

const faqs = storeConfig.faq

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      }),
    },
  ],
})
</script>