<script setup lang="ts">
useSeoMeta({
  title: 'Suivi de commande - ClipBag',
  description: 'Suivez votre commande ClipBag en temps réel. Entrez votre numéro de commande ou vos coordonnées.',
  ogTitle: 'Suivi de commande - ClipBag',
  ogDescription: 'Suivez votre commande ClipBag en temps réel.',
})

useHead({
  link: [{ rel: 'canonical', href: `https://clipbag.shop${useRoute().path}` }],
})

const { apiFetch } = useApi()

const activeTab = ref<'order' | 'name'>('order')
const orderNumber = ref('')
const name = ref('')
const email = ref('')
const loading = ref(false)
const error = ref('')
const orders = ref<any[]>([])
const selectedOrder = ref<any>(null)

const steps = [
  { status: 'PENDING', label: 'Commande reçue', icon: 'clipboard' },
  { status: 'PAID', label: 'Paiement confirmé', icon: 'credit-card' },
  { status: 'PROCESSING', label: 'En préparation', icon: 'cog' },
  { status: 'SHIPPED', label: 'Expédiée', icon: 'truck' },
  { status: 'DELIVERED', label: 'Livrée', icon: 'check-circle' },
]

const statusOrder = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED']

const { statusLabels } = useOrderStatus()

const statusDotColors: Record<string, string> = {
  PENDING: 'bg-yellow-400',
  PAID: 'bg-green-400',
  PROCESSING: 'bg-blue-400',
  SHIPPED: 'bg-purple-400',
  DELIVERED: 'bg-emerald-400',
  CANCELLED: 'bg-red-400',
}

function isCancelledOrder(o: any) {
  return o?.status === 'CANCELLED'
}

function getStepIndex(o: any) {
  if (!o) return -1
  return statusOrder.indexOf(o.status)
}

function isStepActive(o: any, index: number) {
  if (isCancelledOrder(o)) return false
  return index <= getStepIndex(o)
}

function isStepCurrent(o: any, index: number) {
  if (isCancelledOrder(o)) return false
  return index === getStepIndex(o)
}

function getEstimatedDate(o: any, index: number) {
  if (!o) return ''
  const base = new Date(o.createdAt)
  const offsets = [0, 0, 1, 2, 5]
  const d = new Date(base)
  d.setDate(d.getDate() + offsets[index])
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

function formatOrderNumber(num: number) {
  return `GS-${String(num).padStart(5, '0')}`
}

function selectOrder(o: any) {
  selectedOrder.value = selectedOrder.value?.id === o.id ? null : o
}

async function submit() {
  error.value = ''
  orders.value = []
  selectedOrder.value = null
  loading.value = true

  try {
    const body: any = {}
    if (activeTab.value === 'order') {
      if (!orderNumber.value.trim()) {
        error.value = 'Veuillez entrer un numéro de commande.'
        loading.value = false
        return
      }
      body.orderNumber = orderNumber.value.trim()
    } else {
      if (!name.value.trim() || !email.value.trim()) {
        error.value = 'Veuillez remplir tous les champs.'
        loading.value = false
        return
      }
      body.name = name.value.trim()
      body.email = email.value.trim()
    }

    const result = await apiFetch<any>('/tracking/lookup', {
      method: 'POST',
      body,
    })
    // Backend can return a single order or an array
    if (Array.isArray(result)) {
      orders.value = result
    } else {
      orders.value = [result]
    }
    // Auto-select if only one order
    if (orders.value.length === 1) {
      selectedOrder.value = orders.value[0]
    }
  } catch (e: any) {
    error.value = e?.data?.message || 'Commande introuvable. Vérifiez vos informations.'
  } finally {
    loading.value = false
  }
}

// Auto-fill and search from URL query param (?order=123)
const route = useRoute()
onMounted(() => {
  const orderParam = route.query.order as string
  if (orderParam) {
    orderNumber.value = orderParam
    activeTab.value = 'order'
    submit()
  }
})
</script>

<template>
  <div class="min-h-screen py-24 sm:py-32 px-4 sm:px-6 bg-surface-dark">
    <div class="max-w-3xl mx-auto">
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-brand transition-colors duration-200 mb-8 cursor-pointer"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Retour à l'accueil
      </NuxtLink>

      <h1 class="font-display font-black text-3xl sm:text-4xl text-white mb-4">
        Suivi de commande
      </h1>
      <p class="text-gray-400 mb-10">
        Entrez votre numéro de commande ou vos coordonnées pour suivre votre colis.
      </p>

      <!-- Tabs -->
      <div class="flex gap-1 bg-surface-darker rounded-xl p-1 mb-8">
        <button
          class="flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200"
          :class="activeTab === 'order'
            ? 'bg-brand text-white shadow-lg shadow-brand/25'
            : 'text-gray-400 hover:text-white'"
          @click="activeTab = 'order'"
        >
          Par numéro de commande
        </button>
        <button
          class="flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200"
          :class="activeTab === 'name'
            ? 'bg-brand text-white shadow-lg shadow-brand/25'
            : 'text-gray-400 hover:text-white'"
          @click="activeTab = 'name'"
        >
          Par nom
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submit" class="space-y-4 mb-12">
        <div v-if="activeTab === 'order'">
          <label class="block text-sm font-medium text-gray-300 mb-2">Numéro de commande</label>
          <input
            v-model="orderNumber"
            type="text"
            placeholder="Ex: 3f2a8b1c-..."
            class="w-full px-4 py-3 bg-surface-darker border border-surface-lighter rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
          />
        </div>

        <div v-if="activeTab === 'name'" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Nom complet</label>
            <input
              v-model="name"
              type="text"
              placeholder="Jean Dupont"
              class="w-full px-4 py-3 bg-surface-darker border border-surface-lighter rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Adresse email</label>
            <input
              v-model="email"
              type="email"
              placeholder="jean@exemple.fr"
              class="w-full px-4 py-3 bg-surface-darker border border-surface-lighter rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3.5 bg-brand hover:bg-brand/90 disabled:opacity-50 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-brand/25"
        >
          <span v-if="loading" class="inline-flex items-center gap-2">
            <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Recherche...
          </span>
          <span v-else>Rechercher ma commande</span>
        </button>
      </form>

      <!-- Error -->
      <div v-if="error" class="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-8">
        <p class="text-red-400 text-sm">{{ error }}</p>
      </div>

      <!-- Results -->
      <div v-if="orders.length > 0" class="space-y-4 animate-fade-in">
        <!-- Multiple orders info -->
        <p v-if="orders.length > 1" class="text-gray-400 text-sm mb-2">
          {{ orders.length }} commandes trouvées. Cliquez sur une commande pour voir le détail.
        </p>

        <!-- Order cards list -->
        <div
          v-for="o in orders"
          :key="o.id"
          class="space-y-0"
        >
          <!-- Order summary card (always visible) -->
          <button
            :class="[
              'w-full text-left bg-surface-darker rounded-2xl p-5 border-2 transition-all duration-200 cursor-pointer focus:outline-none',
              selectedOrder?.id === o.id
                ? 'border-brand shadow-lg shadow-brand/10'
                : 'border-surface-lighter hover:border-gray-600'
            ]"
            @click="selectOrder(o)"
          >
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-4">
                <!-- Status dot -->
                <span :class="['w-3 h-3 rounded-full flex-shrink-0', statusDotColors[o.status] || 'bg-gray-400']"></span>
                <!-- Order number -->
                <div>
                  <p class="text-white font-mono font-bold text-sm">{{ formatOrderNumber(o.orderNumber) }}</p>
                  <p class="text-gray-500 text-xs mt-0.5">{{ new Date(o.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) }}</p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <span
                  :class="[
                    'text-xs font-medium px-2.5 py-1 rounded-full',
                    o.status === 'CANCELLED' ? 'bg-red-500/15 text-red-400' :
                    o.status === 'DELIVERED' ? 'bg-emerald-500/15 text-emerald-400' :
                    o.status === 'PAID' ? 'bg-green-500/15 text-green-400' :
                    o.status === 'SHIPPED' ? 'bg-purple-500/15 text-purple-400' :
                    o.status === 'PROCESSING' ? 'bg-blue-500/15 text-blue-400' :
                    'bg-yellow-500/15 text-yellow-400'
                  ]"
                >
                  {{ statusLabels[o.status] || o.status }}
                </span>
                <!-- Chevron -->
                <svg
                  :class="['w-5 h-5 text-gray-500 transition-transform duration-200', selectedOrder?.id === o.id ? 'rotate-180' : '']"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </button>

          <!-- Expanded detail (only for selected order) -->
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 max-h-0"
            enter-to-class="opacity-100 max-h-[2000px]"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 max-h-[2000px]"
            leave-to-class="opacity-0 max-h-0"
          >
            <div v-if="selectedOrder?.id === o.id" class="overflow-hidden mt-3 space-y-6">
              <!-- Cancelled state -->
              <div v-if="isCancelledOrder(o)" class="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
                <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg class="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 class="text-red-400 font-bold text-xl mb-2">Commande annulée</h3>
                <p class="text-red-300/70 text-sm">Cette commande a été annulée. Contactez-nous pour plus d'informations.</p>
              </div>

              <!-- Timeline -->
              <div v-else class="bg-surface-light rounded-2xl p-6 sm:p-8 border border-white/5">
                <h2 class="text-white font-bold text-lg mb-8">Statut de la commande</h2>

                <!-- Desktop horizontal timeline -->
                <div class="hidden md:block">
                  <div class="flex items-start justify-between relative">
                    <div class="absolute top-5 left-[10%] right-[10%] h-1 bg-surface-lighter rounded-full" />
                    <div
                      class="absolute top-5 left-[10%] h-1 bg-brand rounded-full transition-all duration-1000 ease-out"
                      :style="{ width: getStepIndex(o) >= 0 ? `${(getStepIndex(o) / (steps.length - 1)) * 80}%` : '0%' }"
                    />
                    <div
                      v-for="(step, i) in steps"
                      :key="step.status"
                      class="flex flex-col items-center relative z-10"
                      :style="{ width: `${100 / steps.length}%` }"
                    >
                      <div
                        class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 mb-3"
                        :class="[
                          isStepActive(o, i) ? 'bg-brand text-white shadow-lg shadow-brand/30' : 'bg-surface-lighter text-gray-500',
                          isStepCurrent(o, i) ? 'ring-4 ring-brand/30 scale-110' : ''
                        ]"
                      >
                        <svg v-if="step.icon === 'clipboard'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        <svg v-if="step.icon === 'credit-card'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                        <svg v-if="step.icon === 'cog'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.066z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <svg v-if="step.icon === 'truck'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-1 2 1 2-1 2 1m0 0V6m0 10l2-1 2 1m-4-1v-2a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16" /><circle cx="7" cy="19" r="2" /><circle cx="17" cy="19" r="2" /></svg>
                        <svg v-if="step.icon === 'check-circle'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <p class="text-xs font-semibold text-center transition-colors duration-300" :class="isStepActive(o, i) ? 'text-white' : 'text-gray-500'">{{ step.label }}</p>
                      <p class="text-xs text-gray-500 mt-1">{{ getEstimatedDate(o, i) }}</p>
                      <span v-if="step.status === 'DELIVERED' && isStepActive(o, i)" class="mt-1 text-lg animate-bounce">&#127881;</span>
                      <a v-if="step.status === 'SHIPPED' && isStepActive(o, i) && o.trackingUrl" :href="o.trackingUrl" target="_blank" rel="noopener noreferrer" class="mt-2 text-xs text-brand hover:text-brand/80 underline transition-colors">Suivre le colis</a>
                    </div>
                  </div>
                </div>

                <!-- Mobile vertical timeline -->
                <div class="md:hidden space-y-0">
                  <div v-for="(step, i) in steps" :key="step.status" class="flex gap-4 relative">
                    <div class="flex flex-col items-center">
                      <div
                        class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-500"
                        :class="[
                          isStepActive(o, i) ? 'bg-brand text-white shadow-lg shadow-brand/30' : 'bg-surface-lighter text-gray-500',
                          isStepCurrent(o, i) ? 'ring-4 ring-brand/30 scale-110' : ''
                        ]"
                      >
                        <svg v-if="step.icon === 'clipboard'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        <svg v-if="step.icon === 'credit-card'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                        <svg v-if="step.icon === 'cog'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.066z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <svg v-if="step.icon === 'truck'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-1 2 1 2-1 2 1m0 0V6m0 10l2-1 2 1m-4-1v-2a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16" /><circle cx="7" cy="19" r="2" /><circle cx="17" cy="19" r="2" /></svg>
                        <svg v-if="step.icon === 'check-circle'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <div v-if="i < steps.length - 1" class="w-0.5 flex-1 min-h-[40px] transition-colors duration-500" :class="isStepActive(o, i) ? 'bg-brand' : 'bg-surface-lighter'" />
                    </div>
                    <div class="pb-8 pt-2">
                      <p class="font-semibold text-sm transition-colors duration-300" :class="isStepActive(o, i) ? 'text-white' : 'text-gray-500'">{{ step.label }}</p>
                      <p class="text-xs text-gray-500 mt-0.5">{{ getEstimatedDate(o, i) }}</p>
                      <span v-if="step.status === 'DELIVERED' && isStepActive(o, i)" class="inline-block mt-1 text-lg animate-bounce">&#127881;</span>
                      <a v-if="step.status === 'SHIPPED' && isStepActive(o, i) && o.trackingUrl" :href="o.trackingUrl" target="_blank" rel="noopener noreferrer" class="block mt-2 text-xs text-brand hover:text-brand/80 underline transition-colors">Suivre le colis</a>
                    </div>
                  </div>
                </div>

                <!-- Tracking number -->
                <div v-if="o.trackingNumber" class="mt-6 pt-6 border-t border-surface-lighter">
                  <p class="text-gray-400 text-sm">Numéro de suivi : <span class="text-white font-mono">{{ o.trackingNumber }}</span></p>
                </div>
              </div>

              <!-- Order items -->
              <div class="bg-surface-light rounded-2xl p-6 border border-white/5">
                <h2 class="text-white font-bold text-lg mb-4">Articles commandés</h2>
                <div class="divide-y divide-surface-lighter">
                  <div v-for="item in o.items" :key="item.name" class="flex items-center justify-between py-3">
                    <div>
                      <p class="text-white text-sm font-medium">{{ item.name }}</p>
                      <p class="text-gray-500 text-xs">Quantité : {{ item.quantity }}</p>
                    </div>
                    <p class="text-brand font-semibold text-sm">{{ (item.price * item.quantity).toFixed(2) }} EUR</p>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
