<script setup lang="ts">
useSeoMeta({
  title: 'Paiement Annulé - ClipBag',
  robots: 'noindex',
})

const { apiFetch } = useApi()
const route = useRoute()

onMounted(async () => {
  const sessionId = route.query.session_id as string
  if (sessionId) {
    try {
      await apiFetch('/payments/cancel-order', {
        method: 'POST',
        body: { session_id: sessionId },
      })
    } catch {}
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-24">
    <div class="max-w-lg w-full text-center">
      <!-- Red X circle -->
      <div class="w-24 h-24 bg-red-500/15 rounded-full flex items-center justify-center mx-auto mb-8">
        <svg class="w-12 h-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <h1 class="font-display font-black text-3xl sm:text-4xl text-white mb-3">Paiement Annulé</h1>
      <p class="text-gray-400 text-lg mb-4 max-w-sm mx-auto">
        Votre paiement a été annulé. Aucun montant n'a été débité.
      </p>
      <p class="text-gray-500 text-sm mb-10">
        Vous pouvez réessayer à tout moment. Votre panier vous attend.
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <NuxtLink
          to="/#order-section"
          class="group inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-display font-bold text-lg py-4 px-8 rounded-2xl cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-surface shadow-xl shadow-brand/25 hover:shadow-brand/40 hover:scale-105"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à la commande
          <svg class="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </NuxtLink>
      </div>
      <a
        href="mailto:contact@clipbag.shop"
        class="inline-block mt-6 text-sm text-gray-500 hover:text-brand transition-colors duration-200 cursor-pointer"
      >
        Besoin d'aide ? Contactez-nous
      </a>
    </div>
  </div>
</template>
