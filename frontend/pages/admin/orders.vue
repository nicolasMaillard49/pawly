<script setup lang="ts">
import { storeConfig } from '~/config/store.config'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

interface OrderItem {
  id: string
  quantity: number
  price: number
  variant: string | null
  bundleSlug: string | null
  product: {
    name: string
    slug: string
    images: string[]
    supplierUrl: string | null
  }
}

interface Order {
  id: string
  orderNumber: number
  createdAt: string
  updatedAt: string
  customerName: string
  customerEmail: string
  customerPhone: string
  total: number
  status: string
  stripeSessionId: string | null
  stripePaymentId: string | null
  trackingNumber: string | null
  trackingUrl: string | null
  shippingAddress: {
    line1?: string
    line2?: string
    city?: string
    postalCode?: string
    country?: string
  }
  items: OrderItem[]
  supplierOrderId: string | null
  supplierUrl: string | null
}

interface OrdersResponse {
  orders: Order[]
  total: number
  page: number
  totalPages: number
}

const { apiFetch } = useApi()
const authStore = useAuthStore()

const data = ref<OrdersResponse | null>(null)
const loading = ref(true)
const error = ref('')
const currentPage = ref(1)
const updatingOrderId = ref<string | null>(null)
const selectedOrder = ref<Order | null>(null)
const activeTab = ref<'all' | 'to-order' | 'to-ship' | 'done'>('all')

const statuses = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

const { statusLabels, statusColors } = useOrderStatus()

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatPrice = (amount: number) => {
  return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
}

const totalQuantity = (order: Order) => {
  return order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
}

// --- Filtered orders by tab ---
const filteredOrders = computed(() => {
  if (!data.value?.orders) return []
  switch (activeTab.value) {
    case 'to-order':
      return data.value.orders.filter((o) => o.status === 'PAID' && !o.supplierOrderId)
    case 'to-ship':
      return data.value.orders.filter((o) => o.status === 'PROCESSING' && !o.trackingNumber)
    case 'done':
      return data.value.orders.filter((o) => ['SHIPPED', 'DELIVERED'].includes(o.status))
    default:
      return data.value.orders
  }
})

const tabCounts = computed(() => {
  if (!data.value?.orders) return { toOrder: 0, toShip: 0, done: 0 }
  return {
    toOrder: data.value.orders.filter((o) => o.status === 'PAID' && !o.supplierOrderId).length,
    toShip: data.value.orders.filter((o) => o.status === 'PROCESSING' && !o.trackingNumber).length,
    done: data.value.orders.filter((o) => ['SHIPPED', 'DELIVERED'].includes(o.status)).length,
  }
})

// --- API ---
const fetchOrders = async () => {
  loading.value = true
  error.value = ''
  try {
    data.value = await apiFetch<OrdersResponse>(`/admin/orders?page=${currentPage.value}&limit=50`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    })
  } catch (e: any) {
    error.value = e?.data?.message || 'Erreur lors du chargement des commandes'
    if (e?.status === 401) authStore.logout()
  } finally {
    loading.value = false
  }
}

const updateStatus = async (orderId: string, newStatus: string) => {
  updatingOrderId.value = orderId
  try {
    await apiFetch(`/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: { status: newStatus },
    })
    if (data.value) {
      const order = data.value.orders.find((o) => o.id === orderId)
      if (order) order.status = newStatus
    }
    if (selectedOrder.value?.id === orderId) {
      selectedOrder.value.status = newStatus
    }
  } catch (e: any) {
    error.value = e?.data?.message || 'Erreur lors de la mise a jour du statut'
    if (e?.status === 401) authStore.logout()
  } finally {
    updatingOrderId.value = null
  }
}

// --- Modal state ---
const supplierOrderId = ref('')
const supplierUrl = ref('')
const trackingNumber = ref('')
const trackingUrl = ref('')
const savingSupplier = ref(false)
const savingTracking = ref(false)
const copiedAddress = ref(false)
const successMsg = ref('')

const showSuccess = (msg: string) => {
  successMsg.value = msg
  setTimeout(() => { successMsg.value = '' }, 3000)
}

const openOrder = (order: Order) => {
  selectedOrder.value = order
  supplierOrderId.value = order.supplierOrderId || ''
  supplierUrl.value = order.supplierUrl || ''
  trackingNumber.value = order.trackingNumber || ''
  trackingUrl.value = order.trackingUrl || ''
}

const closeOrder = () => {
  selectedOrder.value = null
}

const copyShippingAddress = (order: Order) => {
  const addr = order.shippingAddress
  if (!addr) return
  const lines = [
    order.customerName,
    addr.line1,
    addr.line2,
    `${addr.postalCode || ''} ${addr.city || ''}`.trim(),
    addr.country || 'FR',
  ].filter(Boolean).join('\n')
  navigator.clipboard.writeText(lines)
  copiedAddress.value = true
  setTimeout(() => { copiedAddress.value = false }, 2000)
}

const getBundleLabel = (order: Order) => {
  const slug = order.items?.[0]?.bundleSlug
  if (!slug) return null
  const labels: Record<string, string> = { sport: 'Pack Sport', complet: 'Pack Kit Complet', duo: 'Pack Duo', equipe: 'Pack Équipe' }
  return labels[slug] || `Pack ${slug}`
}

const getSupplierProductUrl = (order: Order) => {
  const productUrl = order.items?.[0]?.product?.supplierUrl
  if (!productUrl) return 'https://www.aliexpress.com'
  const qty = totalQuantity(order)
  try {
    const url = new URL(productUrl)
    url.searchParams.set('quantity', String(qty))
    return url.toString()
  } catch {
    return productUrl
  }
}

// Save supplier info → auto PROCESSING
const saveSupplierInfo = async () => {
  if (!selectedOrder.value) return
  savingSupplier.value = true
  try {
    await apiFetch(`/admin/orders/${selectedOrder.value.id}/supplier`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: {
        supplierOrderId: supplierOrderId.value || undefined,
        supplierUrl: supplierUrl.value || undefined,
      },
    })
    selectedOrder.value.supplierOrderId = supplierOrderId.value || null
    selectedOrder.value.supplierUrl = supplierUrl.value || null

    // Auto-advance to PROCESSING
    if (supplierOrderId.value && selectedOrder.value.status === 'PAID') {
      await updateStatus(selectedOrder.value.id, 'PROCESSING')
    }
    showSuccess('Infos fournisseur sauvegardees')
  } catch (e: any) {
    error.value = e?.data?.message || 'Erreur lors de la sauvegarde'
  } finally {
    savingSupplier.value = false
  }
}

// Save tracking → auto SHIPPED
const saveTracking = async () => {
  if (!selectedOrder.value) return
  savingTracking.value = true
  try {
    await apiFetch(`/admin/orders/${selectedOrder.value.id}/tracking`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: {
        trackingNumber: trackingNumber.value || undefined,
        trackingUrl: trackingUrl.value || undefined,
      },
    })
    selectedOrder.value.trackingNumber = trackingNumber.value || null
    selectedOrder.value.trackingUrl = trackingUrl.value || null

    // Auto-advance to SHIPPED
    if (trackingNumber.value && selectedOrder.value.status === 'PROCESSING') {
      await updateStatus(selectedOrder.value.id, 'SHIPPED')
    }
    showSuccess('Suivi expedition sauvegarde')
  } catch (e: any) {
    error.value = e?.data?.message || 'Erreur lors de la sauvegarde'
  } finally {
    savingTracking.value = false
  }
}

const deletingOrder = ref(false)

const deleteOrder = async (orderId: string) => {
  if (!confirm('Supprimer cette commande ? Cette action est irreversible.')) return
  deletingOrder.value = true
  try {
    await apiFetch(`/admin/orders/${orderId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authStore.token}` },
    })
    if (data.value) {
      data.value.orders = data.value.orders.filter((o) => o.id !== orderId)
      data.value.total--
    }
    closeOrder()
  } catch (e: any) {
    error.value = e?.data?.message || 'Erreur lors de la suppression'
    if (e?.status === 401) authStore.logout()
  } finally {
    deletingOrder.value = false
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
  fetchOrders()
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && selectedOrder.value) closeOrder()
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  fetchOrders()
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-white mb-6">Commandes</h1>

    <!-- Loading -->
    <div v-if="loading" class="text-gray-400">Chargement...</div>

    <!-- Error -->
    <div v-if="error && !loading" class="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
      {{ error }}
    </div>

    <!-- Tabs -->
    <div v-if="data && !loading" class="flex gap-2 mb-4 flex-wrap">
      <button
        :class="[
          'px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer',
          activeTab === 'all'
            ? 'bg-white/10 text-white'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        ]"
        @click="activeTab = 'all'"
      >
        Toutes ({{ data.total }})
      </button>
      <button
        :class="[
          'px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2',
          activeTab === 'to-order'
            ? 'bg-orange-500/20 text-orange-400'
            : 'text-gray-400 hover:text-orange-400 hover:bg-orange-500/10'
        ]"
        @click="activeTab = 'to-order'"
      >
        A commander
        <span v-if="tabCounts.toOrder > 0" class="bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {{ tabCounts.toOrder }}
        </span>
      </button>
      <button
        :class="[
          'px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2',
          activeTab === 'to-ship'
            ? 'bg-blue-500/20 text-blue-400'
            : 'text-gray-400 hover:text-blue-400 hover:bg-blue-500/10'
        ]"
        @click="activeTab = 'to-ship'"
      >
        A expedier
        <span v-if="tabCounts.toShip > 0" class="bg-blue-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {{ tabCounts.toShip }}
        </span>
      </button>
      <button
        :class="[
          'px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer',
          activeTab === 'done'
            ? 'bg-emerald-500/20 text-emerald-400'
            : 'text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10'
        ]"
        @click="activeTab = 'done'"
      >
        Terminees ({{ tabCounts.done }})
      </button>
    </div>

    <!-- Order detail modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="selectedOrder"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="closeOrder" />

          <!-- Modal -->
          <div class="relative bg-surface-light border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-surface-light z-10">
              <div>
                <h2 id="modal-title" class="text-lg font-bold text-white">
                  Commande {{ storeConfig.orderPrefix }}-{{ String(selectedOrder.orderNumber || '').padStart(5, '0') }}
                </h2>
                <p class="text-xs text-gray-500 font-mono mt-0.5">{{ selectedOrder.id }}</p>
              </div>
              <button
                aria-label="Fermer"
                class="text-gray-400 hover:text-white transition-colors cursor-pointer p-2 -mr-2 rounded-lg hover:bg-white/5"
                @click="closeOrder"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="p-6 space-y-6">
              <!-- Success feedback -->
              <Transition
                enter-active-class="transition-all duration-200"
                enter-from-class="opacity-0 -translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-150"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-2"
              >
                <div v-if="successMsg" class="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm font-medium">
                  {{ successMsg }}
                </div>
              </Transition>

              <!-- Status + Date -->
              <div class="flex items-center justify-between">
                <span
                  :class="statusColors[selectedOrder.status]"
                  class="inline-block px-3 py-1 rounded-full text-sm font-medium"
                >
                  {{ statusLabels[selectedOrder.status] || selectedOrder.status }}
                </span>
                <div class="text-right">
                  <p class="text-xs text-gray-500">Cree le</p>
                  <p class="text-sm text-gray-300">{{ formatDate(selectedOrder.createdAt) }}</p>
                </div>
              </div>

              <!-- Client info -->
              <div class="bg-surface-darker rounded-xl p-4 border border-white/5 space-y-3">
                <h3 class="text-sm font-semibold text-white">Client</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p class="text-xs text-gray-500">Nom</p>
                    <p class="text-white">{{ selectedOrder.customerName || '—' }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Email</p>
                    <p class="text-white">{{ selectedOrder.customerEmail || '—' }}</p>
                  </div>
                  <div v-if="selectedOrder.customerPhone">
                    <p class="text-xs text-gray-500">Telephone</p>
                    <p class="text-white">
                      <a :href="`tel:${selectedOrder.customerPhone}`" class="hover:text-brand transition-colors">{{ selectedOrder.customerPhone }}</a>
                    </p>
                  </div>
                </div>
              </div>

              <!-- Shipping address -->
              <div v-if="selectedOrder.shippingAddress && Object.keys(selectedOrder.shippingAddress).length > 0" class="bg-surface-darker rounded-xl p-4 border border-white/5 space-y-3">
                <div class="flex items-center justify-between">
                  <h3 class="text-sm font-semibold text-white">Adresse de livraison</h3>
                  <button
                    class="text-xs text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                    @click="copyShippingAddress(selectedOrder)"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {{ copiedAddress ? 'Copiee !' : 'Copier' }}
                  </button>
                </div>
                <div class="text-sm text-gray-300 space-y-1">
                  <p v-if="selectedOrder.shippingAddress.line1">{{ selectedOrder.shippingAddress.line1 }}</p>
                  <p v-if="selectedOrder.shippingAddress.line2">{{ selectedOrder.shippingAddress.line2 }}</p>
                  <p>
                    <span v-if="selectedOrder.shippingAddress.postalCode">{{ selectedOrder.shippingAddress.postalCode }} </span>
                    <span v-if="selectedOrder.shippingAddress.city">{{ selectedOrder.shippingAddress.city }}</span>
                  </p>
                  <p v-if="selectedOrder.shippingAddress.country" class="text-gray-500">{{ selectedOrder.shippingAddress.country }}</p>
                </div>
              </div>

              <!-- STEP 1: Commander chez le fournisseur -->
              <div v-if="selectedOrder.status !== 'PENDING' && selectedOrder.status !== 'CANCELLED'" class="bg-surface-darker rounded-xl p-4 border border-orange-500/20 space-y-4">
                <div class="flex items-center justify-between">
                  <h3 class="text-sm font-semibold text-orange-400 flex items-center gap-2">
                    <span class="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold flex items-center justify-center">1</span>
                    Commander chez AliExpress
                  </h3>
                  <span
                    v-if="selectedOrder.supplierOrderId"
                    class="text-xs font-medium bg-green-500/15 text-green-400 px-2 py-0.5 rounded-full"
                  >Fait</span>
                  <span
                    v-else-if="selectedOrder.status === 'PAID'"
                    class="text-xs font-medium bg-orange-500/15 text-orange-400 px-2 py-0.5 rounded-full animate-pulse"
                  >A faire</span>
                </div>

                <template v-if="!selectedOrder.supplierOrderId">
                  <!-- Action buttons -->
                  <div class="flex gap-2">
                    <button
                      class="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-surface-light border border-white/10 rounded-lg text-sm text-gray-300 hover:bg-surface-lighter hover:text-white transition-colors cursor-pointer"
                      @click="copyShippingAddress(selectedOrder)"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      {{ copiedAddress ? 'Adresse copiee !' : 'Copier l\'adresse' }}
                    </button>
                    <a
                      :href="getSupplierProductUrl(selectedOrder)"
                      target="_blank"
                      rel="noopener"
                      class="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-orange-500/15 border border-orange-500/30 rounded-lg text-sm text-orange-400 hover:bg-orange-500/25 hover:text-orange-300 transition-colors cursor-pointer"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Ouvrir AliExpress
                    </a>
                  </div>

                  <ol class="text-xs text-gray-600 space-y-0.5 list-decimal list-inside">
                    <li>Copier l'adresse client</li>
                    <li>Ouvrir AliExpress et passer la commande ({{ totalQuantity(selectedOrder) }}x)</li>
                    <li>Coller le n° de commande ci-dessous</li>
                  </ol>
                </template>

                <!-- Supplier order ID + URL -->
                <div class="space-y-2">
                  <div>
                    <label for="supplier-order-id" class="block text-xs text-gray-500 mb-1">N° commande AliExpress</label>
                    <input
                      id="supplier-order-id"
                      v-model="supplierOrderId"
                      type="text"
                      placeholder="ex: 8215637284920163"
                      class="w-full bg-surface-light border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/50 placeholder-gray-600"
                    />
                  </div>
                  <div>
                    <label for="supplier-url-modal" class="block text-xs text-gray-500 mb-1">Lien commande (optionnel)</label>
                    <input
                      id="supplier-url-modal"
                      v-model="supplierUrl"
                      type="text"
                      placeholder="https://www.aliexpress.com/order/..."
                      class="w-full bg-surface-light border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/50 placeholder-gray-600"
                    />
                  </div>
                  <button
                    :disabled="savingSupplier || !supplierOrderId"
                    class="w-full py-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 text-sm font-medium rounded-lg hover:bg-orange-500/30 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    @click="saveSupplierInfo"
                  >
                    {{ savingSupplier ? 'Sauvegarde...' : selectedOrder.status === 'PAID' ? 'Valider → Passe en traitement' : 'Sauvegarder' }}
                  </button>
                </div>
              </div>

              <!-- STEP 2: Tracking / expedition -->
              <div v-if="['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(selectedOrder.status)" class="bg-surface-darker rounded-xl p-4 border border-blue-500/20 space-y-4">
                <div class="flex items-center justify-between">
                  <h3 class="text-sm font-semibold text-blue-400 flex items-center gap-2">
                    <span class="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center">2</span>
                    Suivi expedition
                  </h3>
                  <span
                    v-if="selectedOrder.trackingNumber"
                    class="text-xs font-medium bg-green-500/15 text-green-400 px-2 py-0.5 rounded-full"
                  >Fait</span>
                  <span
                    v-else-if="selectedOrder.status === 'PROCESSING'"
                    class="text-xs font-medium bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded-full"
                  >En attente du tracking</span>
                </div>

                <div class="space-y-2">
                  <div>
                    <label for="tracking-number" class="block text-xs text-gray-500 mb-1">Numero de suivi</label>
                    <input
                      id="tracking-number"
                      v-model="trackingNumber"
                      type="text"
                      placeholder="ex: LP123456789CN"
                      class="w-full bg-surface-light border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-gray-600"
                    />
                  </div>
                  <div>
                    <label for="tracking-url" class="block text-xs text-gray-500 mb-1">Lien de suivi (optionnel)</label>
                    <input
                      id="tracking-url"
                      v-model="trackingUrl"
                      type="text"
                      placeholder="https://track.aliexpress.com/..."
                      class="w-full bg-surface-light border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-gray-600"
                    />
                  </div>
                  <button
                    :disabled="savingTracking || !trackingNumber"
                    class="w-full py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm font-medium rounded-lg hover:bg-blue-500/30 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    @click="saveTracking"
                  >
                    {{ savingTracking ? 'Sauvegarde...' : selectedOrder.status === 'PROCESSING' ? 'Valider → Passe en expediee' : 'Sauvegarder' }}
                  </button>
                </div>
              </div>

              <!-- Order items -->
              <div class="bg-surface-darker rounded-xl p-4 border border-white/5 space-y-3">
                <h3 class="text-sm font-semibold text-white">Articles</h3>
                <!-- Bundle header -->
                <div v-if="getBundleLabel(selectedOrder)" class="px-3 py-1.5 bg-brand/10 rounded-lg flex items-center gap-2">
                  <span class="text-xs font-semibold text-brand">{{ getBundleLabel(selectedOrder) }}</span>
                  <span class="text-xs text-gray-400">{{ formatPrice(selectedOrder.total) }}</span>
                </div>
                <div
                  v-for="item in selectedOrder.items"
                  :key="item.id"
                  class="flex items-center gap-4 py-3 border-b border-white/5 last:border-b-0"
                >
                  <div class="w-12 h-12 rounded-lg overflow-hidden bg-surface-light flex-shrink-0 border border-white/10">
                    <img
                      v-if="item.product?.images?.[0]"
                      :src="item.product.images[0]"
                      :alt="item.product.name"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm text-white font-medium truncate">{{ item.product?.name || 'Produit' }}</p>
                    <p v-if="item.variant" class="text-xs text-gray-500 capitalize">{{ item.variant }}</p>
                  </div>
                  <div class="flex items-center gap-3 flex-shrink-0">
                    <a v-if="item.product?.supplierUrl" :href="item.product.supplierUrl" target="_blank" rel="noopener" class="text-[11px] text-orange-400 hover:text-orange-300 flex items-center gap-1">
                      <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                      Fournisseur
                    </a>
                    <div class="text-right">
                      <p class="text-sm text-white font-medium">{{ formatPrice(item.price) }}</p>
                      <p class="text-xs text-gray-500">x{{ item.quantity }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Total -->
              <div class="flex items-center justify-between pt-2">
                <span class="text-lg font-semibold text-white">Total</span>
                <span class="text-2xl font-bold text-brand">{{ formatPrice(selectedOrder.total) }}</span>
              </div>

              <!-- Manual status override -->
              <div class="pt-2 border-t border-white/5">
                <label for="manual-status" class="block text-xs text-gray-600 mb-1.5">Forcer le statut manuellement</label>
                <select
                  id="manual-status"
                  :value="selectedOrder.status"
                  :disabled="updatingOrderId === selectedOrder.id"
                  class="bg-surface-darker border border-white/10 text-gray-300 text-sm rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brand/50 disabled:opacity-50 cursor-pointer"
                  @change="updateStatus(selectedOrder.id, ($event.target as HTMLSelectElement).value)"
                >
                  <option v-for="s in statuses" :key="s" :value="s">
                    {{ statusLabels[s] || s }}
                  </option>
                </select>
              </div>

              <!-- Stripe IDs -->
              <div v-if="selectedOrder.stripePaymentId" class="text-xs text-gray-600 space-y-1 pt-2 border-t border-white/5">
                <p v-if="selectedOrder.stripeSessionId">Session: <span class="font-mono">{{ selectedOrder.stripeSessionId }}</span></p>
                <p>Payment: <span class="font-mono">{{ selectedOrder.stripePaymentId }}</span></p>
              </div>

              <!-- Delete order -->
              <div class="pt-2 border-t border-white/5">
                <button
                  :disabled="deletingOrder"
                  class="w-full py-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium rounded-lg hover:bg-red-500/20 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  @click="deleteOrder(selectedOrder.id)"
                >
                  {{ deletingOrder ? 'Suppression...' : 'Supprimer cette commande' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <template v-if="data && !loading">
      <!-- Orders table -->
      <div class="bg-surface-light rounded-xl border border-white/10 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-white/10 text-gray-400 text-left">
                <th class="px-5 py-3 font-medium">N°</th>
                <th class="px-5 py-3 font-medium">Date</th>
                <th class="px-5 py-3 font-medium">Client</th>
                <th class="px-5 py-3 font-medium">Qte</th>
                <th class="px-5 py-3 font-medium">Total</th>
                <th class="px-5 py-3 font-medium">Statut</th>
                <th class="px-5 py-3 font-medium">Fournisseur</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="order in filteredOrders"
                :key="order.id"
                class="border-b border-white/5 hover:bg-white/[0.03] transition-colors cursor-pointer"
                @click="openOrder(order)"
              >
                <td class="px-5 py-3 text-gray-400 font-mono text-xs">{{ storeConfig.orderPrefix }}-{{ String(order.orderNumber || '').padStart(5, '0') }}</td>
                <td class="px-5 py-3 text-gray-300 whitespace-nowrap text-xs">{{ formatDate(order.createdAt) }}</td>
                <td class="px-5 py-3">
                  <p class="text-white text-sm">{{ order.customerName || '—' }}</p>
                  <p class="text-xs text-gray-500">{{ order.customerEmail || '—' }}</p>
                </td>
                <td class="px-5 py-3 text-gray-300">{{ totalQuantity(order) }}</td>
                <td class="px-5 py-3 text-white font-medium whitespace-nowrap">{{ formatPrice(order.total) }}</td>
                <td class="px-5 py-3">
                  <span
                    :class="statusColors[order.status] || 'bg-gray-500/15 text-gray-400'"
                    class="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ statusLabels[order.status] || order.status }}
                  </span>
                </td>
                <td class="px-5 py-3">
                  <span v-if="order.supplierOrderId" class="text-green-400 text-xs">{{ order.supplierOrderId }}</span>
                  <span v-else-if="order.status === 'PAID'" class="text-orange-400 text-xs font-medium">A commander</span>
                  <span v-else class="text-gray-600 text-xs">—</span>
                </td>
              </tr>
              <tr v-if="!filteredOrders.length">
                <td colspan="7" class="px-5 py-8 text-center text-gray-500">Aucune commande</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="data.totalPages > 1" class="flex items-center justify-between mt-4">
        <p class="text-sm text-gray-400">
          Page {{ data.page }} sur {{ data.totalPages }} ({{ data.total }} commandes)
        </p>
        <div class="flex gap-2">
          <button
            :disabled="currentPage <= 1"
            class="px-4 py-2 text-sm font-medium bg-surface-light border border-white/10 rounded-lg text-gray-300 hover:bg-surface-lighter disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            @click="goToPage(currentPage - 1)"
          >
            Precedent
          </button>
          <button
            :disabled="currentPage >= data.totalPages"
            class="px-4 py-2 text-sm font-medium bg-surface-light border border-white/10 rounded-lg text-gray-300 hover:bg-surface-lighter disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            @click="goToPage(currentPage + 1)"
          >
            Suivant
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
