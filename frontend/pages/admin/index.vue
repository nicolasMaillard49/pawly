<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

interface Order {
  id: string
  createdAt: string
  customerName: string
  customerEmail: string
  total: number
  status: string
}

interface DashboardData {
  totalOrders: number
  paidOrders: number
  totalRevenue: number
  recentOrders: Order[]
  monthly: {
    revenue: number
    orderCount: number
    unitsSold: number
  }
  productCostPrice: number
  productPrice: number
}

const { apiFetch } = useApi()
const authStore = useAuthStore()

const dashboard = ref<DashboardData | null>(null)
const loading = ref(true)
const error = ref('')
const showSettings = ref(false)

const { statusLabels, statusColors } = useOrderStatus()

// Profitability config (persisted in localStorage)
const MICRO_ENTREPRISE_RATE = 0.12415 // 12.3% cotisations + 0.1% CFP + 0.015% TFC
const STRIPE_RATE = 0.015 // 1.5% for EU cards
const STRIPE_FIXED = 0.25 // 0.25€ per transaction

const adSpend = ref(250)
const shippingCostPerOrder = ref(3)

const loadProfitConfig = () => {
  const saved = localStorage.getItem('clipbag_profit_config')
  if (saved) {
    const config = JSON.parse(saved)
    adSpend.value = config.adSpend ?? 250
    shippingCostPerOrder.value = config.shippingCostPerOrder ?? 3
  }
}

const saveProfitConfig = () => {
  localStorage.setItem('clipbag_profit_config', JSON.stringify({
    adSpend: adSpend.value,
    shippingCostPerOrder: shippingCostPerOrder.value,
  }))
}

// Computed profitability
const profitability = computed(() => {
  if (!dashboard.value) return null
  const { monthly, productCostPrice, productPrice } = dashboard.value

  const cogs = productCostPrice * monthly.unitsSold
  const stripeFees = monthly.revenue * STRIPE_RATE + monthly.orderCount * STRIPE_FIXED
  const shipping = shippingCostPerOrder.value * monthly.orderCount
  const microCharges = monthly.revenue * MICRO_ENTREPRISE_RATE
  const totalCosts = cogs + stripeFees + shipping + microCharges + adSpend.value

  const profit = monthly.revenue - totalCosts

  // Break-even: margin per solo sale
  const stripeFeePerSale = productPrice * STRIPE_RATE + STRIPE_FIXED
  const microPerSale = productPrice * MICRO_ENTREPRISE_RATE
  const marginPerSale = productPrice - productCostPrice - stripeFeePerSale - shippingCostPerOrder.value - microPerSale

  const salesNeeded = marginPerSale > 0 ? Math.ceil(adSpend.value / marginPerSale) : 0
  const salesRemaining = Math.max(0, salesNeeded - monthly.unitsSold)

  return {
    revenue: monthly.revenue,
    orderCount: monthly.orderCount,
    unitsSold: monthly.unitsSold,
    cogs,
    stripeFees,
    shipping,
    microCharges,
    adSpend: adSpend.value,
    totalCosts,
    profit,
    marginPerSale,
    salesNeeded,
    salesRemaining,
  }
})

// Visual cost breakdown for stacked bar
const costSegments = computed(() => {
  if (!profitability.value || profitability.value.totalCosts === 0) return []
  const p = profitability.value
  const total = p.totalCosts
  return [
    { key: 'cogs', label: 'Achat', value: p.cogs, pct: (p.cogs / total) * 100, color: 'bg-orange-400', dot: 'bg-orange-400' },
    { key: 'pub', label: 'Pub', value: p.adSpend, pct: (p.adSpend / total) * 100, color: 'bg-pink-400', dot: 'bg-pink-400' },
    { key: 'micro', label: 'Cotisations', value: p.microCharges, pct: (p.microCharges / total) * 100, color: 'bg-cyan-400', dot: 'bg-cyan-400' },
    { key: 'shipping', label: 'Livraison', value: p.shipping, pct: (p.shipping / total) * 100, color: 'bg-blue-400', dot: 'bg-blue-400' },
    { key: 'stripe', label: 'Stripe', value: p.stripeFees, pct: (p.stripeFees / total) * 100, color: 'bg-violet-400', dot: 'bg-violet-400' },
  ]
})

// Break-even progress (0-100)
const breakEvenPct = computed(() => {
  if (!profitability.value) return 0
  const p = profitability.value
  if (p.salesNeeded === 0) return 100
  return Math.min(100, Math.round((p.unitsSold / p.salesNeeded) * 100))
})

// Revenue vs Costs ratio visual
const revenueVsCostsPct = computed(() => {
  if (!profitability.value) return { revenue: 50, costs: 50 }
  const p = profitability.value
  const max = Math.max(p.revenue, p.totalCosts, 1)
  return {
    revenue: Math.round((p.revenue / max) * 100),
    costs: Math.round((p.totalCosts / max) * 100),
  }
})

const currentMonth = computed(() => {
  return new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
})

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const formatPrice = (amount: number) => {
  return amount.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  })
}

const formatCompact = (amount: number) => {
  if (Math.abs(amount) >= 1000) {
    return (amount / 1000).toFixed(1).replace('.', ',') + 'k€'
  }
  return amount.toFixed(0).replace('.', ',') + '€'
}

const fetchDashboard = async () => {
  loading.value = true
  error.value = ''
  try {
    dashboard.value = await apiFetch<DashboardData>('/admin/dashboard', {
      headers: { Authorization: `Bearer ${authStore.token}` },
    })
  } catch (e: any) {
    error.value = e?.data?.message || 'Erreur lors du chargement du tableau de bord'
    if (e?.status === 401) authStore.logout()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProfitConfig()
  fetchDashboard()
})
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-end justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-white tracking-tight">Tableau de bord</h1>
        <p class="text-sm text-gray-500 mt-1 capitalize">{{ currentMonth }}</p>
      </div>
      <button
        class="text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-pointer flex items-center gap-1.5"
        @click="fetchDashboard"
      >
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Actualiser
      </button>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="space-y-6">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div v-for="i in 4" :key="i" class="h-24 bg-white/[0.03] rounded-2xl animate-pulse" />
      </div>
      <div class="h-80 bg-white/[0.03] rounded-2xl animate-pulse" />
      <div class="h-48 bg-white/[0.03] rounded-2xl animate-pulse" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex flex-col items-center justify-center py-20">
      <div class="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <svg class="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <p class="text-red-400 text-sm mb-3">{{ error }}</p>
      <button class="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer underline underline-offset-2" @click="fetchDashboard">
        Reessayer
      </button>
    </div>

    <template v-else-if="dashboard">
      <!-- ═══════════════════ KPI CARDS ═══════════════════ -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <!-- CA du mois -->
        <div class="group relative bg-white/[0.03] hover:bg-white/[0.05] rounded-2xl p-4 transition-colors overflow-hidden">
          <div class="absolute top-0 left-0 w-1 h-full bg-brand rounded-l-2xl" />
          <p class="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2">CA du mois</p>
          <p class="text-xl lg:text-2xl font-bold text-white tabular-nums">{{ formatPrice(dashboard.monthly.revenue) }}</p>
          <p class="text-xs text-gray-500 mt-1.5">{{ dashboard.monthly.orderCount }} cmd · {{ dashboard.monthly.unitsSold }} unites</p>
        </div>

        <!-- Benefice net -->
        <div v-if="profitability" class="group relative bg-white/[0.03] hover:bg-white/[0.05] rounded-2xl p-4 transition-colors overflow-hidden">
          <div class="absolute top-0 left-0 w-1 h-full rounded-l-2xl" :class="profitability.profit >= 0 ? 'bg-emerald-400' : 'bg-red-400'" />
          <p class="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2">Benefice net</p>
          <p class="text-xl lg:text-2xl font-bold tabular-nums" :class="profitability.profit >= 0 ? 'text-emerald-400' : 'text-red-400'">
            {{ profitability.profit >= 0 ? '+' : '' }}{{ formatPrice(profitability.profit) }}
          </p>
          <p class="text-xs mt-1.5" :class="profitability.profit >= 0 ? 'text-emerald-400/60' : 'text-red-400/60'">
            marge {{ formatPrice(profitability.marginPerSale) }}/vente
          </p>
        </div>

        <!-- Commandes payees -->
        <div class="group relative bg-white/[0.03] hover:bg-white/[0.05] rounded-2xl p-4 transition-colors overflow-hidden">
          <div class="absolute top-0 left-0 w-1 h-full bg-amber-400 rounded-l-2xl" />
          <p class="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2">Payees</p>
          <p class="text-xl lg:text-2xl font-bold text-white tabular-nums">{{ dashboard.paidOrders }}</p>
          <p class="text-xs text-gray-500 mt-1.5">sur {{ dashboard.totalOrders }} totales</p>
        </div>

        <!-- CA Total -->
        <div class="group relative bg-white/[0.03] hover:bg-white/[0.05] rounded-2xl p-4 transition-colors overflow-hidden">
          <div class="absolute top-0 left-0 w-1 h-full bg-violet-400 rounded-l-2xl" />
          <p class="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2">CA total</p>
          <p class="text-xl lg:text-2xl font-bold text-white tabular-nums">{{ formatPrice(dashboard.totalRevenue) }}</p>
          <p class="text-xs text-gray-500 mt-1.5">depuis le lancement</p>
        </div>
      </div>

      <!-- ═══════════════════ PROFITABILITY ═══════════════════ -->
      <div v-if="profitability" class="bg-white/[0.03] rounded-2xl overflow-hidden mb-6">
        <!-- Header with settings toggle -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <h2 class="text-sm font-semibold text-white tracking-wide">Rentabilite</h2>
          <button
            class="flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
            @click="showSettings = !showSettings"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Parametres
          </button>
        </div>

        <!-- Collapsible settings -->
        <div v-if="showSettings" class="px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <div class="flex flex-wrap gap-4 items-end">
            <div class="flex-1 min-w-[140px]">
              <label for="ad-spend" class="block text-[11px] font-medium text-gray-500 mb-1">Budget pub/mois</label>
              <div class="relative">
                <input
                  id="ad-spend"
                  v-model.number="adSpend"
                  type="number"
                  step="10"
                  min="0"
                  class="w-full pl-3 pr-8 py-1.5 bg-white/[0.05] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand/50 transition-colors tabular-nums"
                  @change="saveProfitConfig"
                />
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-600">EUR</span>
              </div>
            </div>
            <div class="flex-1 min-w-[140px]">
              <label for="shipping-cost" class="block text-[11px] font-medium text-gray-500 mb-1">Livraison/cmd</label>
              <div class="relative">
                <input
                  id="shipping-cost"
                  v-model.number="shippingCostPerOrder"
                  type="number"
                  step="0.5"
                  min="0"
                  class="w-full pl-3 pr-8 py-1.5 bg-white/[0.05] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand/50 transition-colors tabular-nums"
                  @change="saveProfitConfig"
                />
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-600">EUR</span>
              </div>
            </div>
            <p class="w-full text-[10px] text-gray-600 leading-relaxed">
              Micro-entreprise : cotisations 12,3% + CFP 0,1% + TFC 0,015% du CA. Franchise TVA sous 85 000EUR. Stripe : 1,5% + 0,25EUR/transaction.
            </p>
          </div>
        </div>

        <div class="p-5">
          <!-- Two-column layout on desktop -->
          <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">

            <!-- LEFT: Revenue vs Costs + Break-even -->
            <div class="lg:col-span-2 space-y-5">
              <!-- Revenue vs Costs bars -->
              <div class="space-y-3">
                <p class="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Revenue vs Charges</p>

                <!-- Revenue bar -->
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="text-xs text-gray-400">Chiffre d'affaires</span>
                    <span class="text-xs text-white font-medium tabular-nums">{{ formatPrice(profitability.revenue) }}</span>
                  </div>
                  <div class="h-3 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      class="h-full bg-gradient-to-r from-brand to-emerald-400 rounded-full transition-all duration-700"
                      :style="{ width: revenueVsCostsPct.revenue + '%' }"
                    />
                  </div>
                </div>

                <!-- Costs bar -->
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="text-xs text-gray-400">Total charges</span>
                    <span class="text-xs text-white font-medium tabular-nums">{{ formatPrice(profitability.totalCosts) }}</span>
                  </div>
                  <div class="h-3 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      class="h-full bg-gradient-to-r from-red-500/80 to-orange-400/80 rounded-full transition-all duration-700"
                      :style="{ width: revenueVsCostsPct.costs + '%' }"
                    />
                  </div>
                </div>
              </div>

              <!-- Break-even gauge -->
              <div class="bg-white/[0.03] rounded-xl p-4">
                <div class="flex items-center justify-between mb-3">
                  <p class="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Seuil de rentabilite</p>
                  <span class="text-xs font-bold tabular-nums" :class="breakEvenPct >= 100 ? 'text-emerald-400' : 'text-amber-400'">
                    {{ breakEvenPct }}%
                  </span>
                </div>

                <!-- Progress bar -->
                <div class="h-2.5 bg-white/[0.06] rounded-full overflow-hidden mb-3">
                  <div
                    class="h-full rounded-full transition-all duration-1000"
                    :class="breakEvenPct >= 100 ? 'bg-emerald-400' : 'bg-gradient-to-r from-amber-500 to-amber-300'"
                    :style="{ width: breakEvenPct + '%' }"
                  />
                </div>

                <div class="flex items-center justify-between text-xs">
                  <span class="text-gray-500">
                    <span class="text-white font-medium tabular-nums">{{ profitability.unitsSold }}</span> / {{ profitability.salesNeeded }} ventes
                  </span>
                  <span v-if="profitability.salesRemaining > 0" class="text-amber-400/80">
                    encore {{ profitability.salesRemaining }}
                  </span>
                  <span v-else class="text-emerald-400 font-medium">
                    Rentable
                  </span>
                </div>
              </div>
            </div>

            <!-- RIGHT: Cost breakdown -->
            <div class="lg:col-span-3 space-y-4">
              <p class="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Repartition des charges</p>

              <!-- Stacked bar -->
              <div class="h-5 rounded-full overflow-hidden flex bg-white/[0.06]">
                <div
                  v-for="seg in costSegments"
                  :key="seg.key"
                  :class="[seg.color, 'h-full transition-all duration-700 first:rounded-l-full last:rounded-r-full']"
                  :style="{ width: seg.pct + '%' }"
                  :title="`${seg.label}: ${formatPrice(seg.value)} (${Math.round(seg.pct)}%)`"
                />
              </div>

              <!-- Legend + amounts -->
              <div class="space-y-2">
                <div
                  v-for="seg in costSegments"
                  :key="seg.key"
                  class="flex items-center gap-3 group"
                >
                  <!-- Dot -->
                  <span :class="[seg.dot, 'w-2.5 h-2.5 rounded-full shrink-0']" />

                  <!-- Label -->
                  <span class="text-xs text-gray-400 flex-1">{{ seg.label }}</span>

                  <!-- Mini bar -->
                  <div class="w-20 h-1.5 bg-white/[0.06] rounded-full overflow-hidden hidden sm:block">
                    <div :class="[seg.color, 'h-full rounded-full opacity-60']" :style="{ width: seg.pct + '%' }" />
                  </div>

                  <!-- Percentage -->
                  <span class="text-[11px] text-gray-600 tabular-nums w-9 text-right">{{ Math.round(seg.pct) }}%</span>

                  <!-- Amount -->
                  <span class="text-xs text-white font-medium tabular-nums w-20 text-right">{{ formatPrice(seg.value) }}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- ═══════════════════ RECENT ORDERS ═══════════════════ -->
      <div class="bg-white/[0.03] rounded-2xl overflow-hidden">
        <div class="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h2 class="text-sm font-semibold text-white tracking-wide">Commandes recentes</h2>
          <NuxtLink to="/admin/orders" class="text-[11px] text-gray-500 hover:text-brand transition-colors">
            Tout voir
          </NuxtLink>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-white/[0.06]">
                <th class="px-5 py-2.5 text-left text-[11px] font-medium text-gray-600 uppercase tracking-wider">Date</th>
                <th class="px-5 py-2.5 text-left text-[11px] font-medium text-gray-600 uppercase tracking-wider">Client</th>
                <th class="px-5 py-2.5 text-left text-[11px] font-medium text-gray-600 uppercase tracking-wider hidden md:table-cell">Email</th>
                <th class="px-5 py-2.5 text-right text-[11px] font-medium text-gray-600 uppercase tracking-wider">Total</th>
                <th class="px-5 py-2.5 text-right text-[11px] font-medium text-gray-600 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="order in dashboard.recentOrders"
                :key="order.id"
                class="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
              >
                <td class="px-5 py-3 text-gray-500 tabular-nums text-xs">{{ formatDate(order.createdAt) }}</td>
                <td class="px-5 py-3 text-white text-xs font-medium">{{ order.customerName || '—' }}</td>
                <td class="px-5 py-3 text-gray-500 text-xs hidden md:table-cell">{{ order.customerEmail || '—' }}</td>
                <td class="px-5 py-3 text-white text-xs font-medium tabular-nums text-right">{{ formatPrice(order.total) }}</td>
                <td class="px-5 py-3 text-right">
                  <span
                    :class="statusColors[order.status] || 'bg-gray-500/15 text-gray-400'"
                    class="inline-block px-2 py-0.5 rounded-md text-[11px] font-medium"
                  >
                    {{ statusLabels[order.status] || order.status }}
                  </span>
                </td>
              </tr>
              <tr v-if="!dashboard.recentOrders?.length">
                <td colspan="5" class="px-5 py-12 text-center">
                  <p class="text-gray-600 text-sm">Aucune commande pour le moment</p>
                  <p class="text-gray-700 text-xs mt-1">Les commandes apparaitront ici</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>
