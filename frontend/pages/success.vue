<script setup lang="ts">
useSeoMeta({
  title: 'Commande Confirmée - ClipBag',
  robots: 'noindex',
})

const route = useRoute()
const { track: fbTrack } = useMetaPixel()
const loading = ref(true)
const order = ref<any>(null)

onMounted(async () => {
  const sessionId = route.query.session_id as string
  if (sessionId) {
    try {
      const { apiFetch } = useApi()
      const data = await apiFetch<any>(`/payments/session-status?session_id=${sessionId}`)
      order.value = data.order

      if (data.order) {
        fbTrack('Purchase', {
          content_ids: data.order.items?.map((i: any) => i.productId) || [],
          content_type: 'product',
          num_items: data.order.items?.reduce((s: number, i: any) => s + i.quantity, 0) || 1,
          value: data.order.total,
          currency: 'EUR',
        })
      }
    } catch (e) {
      console.error('Failed to fetch session status:', e)
    }
  }
  loading.value = false
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-24">
    <div class="max-w-lg w-full">
      <!-- Loading state -->
      <div v-if="loading" class="text-center">
        <div class="animate-pulse">
          <div class="w-24 h-24 bg-surface-lighter rounded-full mx-auto mb-8"></div>
          <div class="h-8 bg-surface-lighter rounded-lg w-64 mx-auto mb-4"></div>
          <div class="h-5 bg-surface-lighter rounded w-80 mx-auto"></div>
        </div>
      </div>

      <!-- Success state -->
      <div v-else class="text-center">
        <!-- Animated checkmark -->
        <div class="relative w-24 h-24 mx-auto mb-8">
          <div class="absolute inset-0 bg-brand/20 rounded-full motion-safe:animate-ping opacity-20"></div>
          <div class="relative w-24 h-24 bg-brand/20 rounded-full flex items-center justify-center">
            <svg class="w-12 h-12 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 class="font-display font-black text-3xl sm:text-4xl text-white mb-3">Commande Confirmée !</h1>
        <p class="text-gray-400 text-lg mb-10 max-w-sm mx-auto">
          Merci pour votre achat. Vous recevrez un email de confirmation sous quelques minutes.
        </p>

        <!-- Order details card -->
        <div v-if="order" class="bg-surface-light border border-surface-lighter rounded-2xl p-6 sm:p-8 text-left mb-10">
          <h2 class="font-display font-bold text-lg text-white mb-5">Récapitulatif</h2>
          <div class="space-y-4">
            <div v-if="order.orderNumber" class="flex justify-between items-center">
              <span class="text-gray-400">N° de commande</span>
              <NuxtLink
                :to="`/suivi?order=${order.orderNumber}`"
                class="text-brand hover:text-brand-light font-mono font-bold text-lg transition-colors duration-200 cursor-pointer underline underline-offset-4 decoration-brand/30 hover:decoration-brand"
              >
                GS-{{ String(order.orderNumber).padStart(5, '0') }}
              </NuxtLink>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-400">Produit</span>
              <span class="text-white font-medium">{{ order.items?.[0]?.product?.name }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-400">Quantité</span>
              <span class="text-white font-medium">{{ order.items?.[0]?.quantity }}</span>
            </div>
            <div v-if="order.items?.[0]?.variant" class="flex justify-between items-center">
              <span class="text-gray-400">Variante</span>
              <span class="text-white font-medium capitalize">{{ order.items?.[0]?.variant }}</span>
            </div>
            <div class="border-t border-surface-lighter pt-4 flex justify-between items-center">
              <span class="text-white font-semibold">Total</span>
              <span class="text-brand font-display font-medium text-[34px] tracking-tight leading-none">{{ order.total?.toFixed(2).replace('.', ',') }}&euro;</span>
            </div>
          </div>
        </div>

        <!-- Next steps -->
        <div class="bg-surface-light/50 border border-surface-lighter rounded-xl p-5 text-left mb-10">
          <h3 class="font-semibold text-white text-sm mb-3">Prochaines étapes</h3>
          <ul class="space-y-2 text-sm text-gray-400">
            <li class="flex items-start gap-2">
              <svg class="w-4 h-4 text-brand mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Email de confirmation envoyé
            </li>
            <li class="flex items-start gap-2">
              <svg class="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
              </svg>
              Préparation et expédition sous 48h
            </li>
            <li class="flex items-start gap-2">
              <svg class="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
              </svg>
              Numéro de suivi envoyé par email
            </li>
            <li class="flex items-start gap-2">
              <svg class="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
              </svg>
              Livraison estimée : 5 à 7 jours ouvrés
            </li>
          </ul>
        </div>

        <!-- Track order link -->
        <div v-if="order?.orderNumber" class="mb-8">
          <NuxtLink
            :to="`/suivi?order=${order.orderNumber}`"
            class="inline-flex items-center gap-2 text-brand hover:text-brand-light font-medium transition-colors duration-200 cursor-pointer"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Suivre ma commande GS-{{ String(order.orderNumber).padStart(5, '0') }}
          </NuxtLink>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <NuxtLink
            to="/#order-section"
            class="group inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-display font-bold text-lg py-4 px-8 rounded-2xl cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-surface shadow-xl shadow-brand/25 hover:shadow-brand/40 hover:scale-105"
          >
            Commander à nouveau
            <svg class="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </NuxtLink>
          <NuxtLink
            to="/"
            class="text-sm text-gray-400 hover:text-brand transition-colors duration-200 cursor-pointer"
          >
            Retour à l'accueil
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
