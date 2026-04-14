<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

interface BundleItem {
  id: string
  productId: string
  quantity: number
  product: {
    id: string
    name: string
    costPrice: number
    supplierUrl: string | null
  }
}

interface Bundle {
  id: string
  slug: string
  label: string
  description: string
  price: number
  comparePrice: number | null
  badge: string | null
  position: number
  active: boolean
  items: BundleItem[]
}

interface Product {
  id: string
  name: string
  slug: string
  costPrice: number
  supplierUrl: string | null
  active: boolean
}

const { apiFetch } = useApi()
const authStore = useAuthStore()

const bundles = ref<Bundle[]>([])
const products = ref<Product[]>([])
const loading = ref(true)
const error = ref('')
const success = ref('')
const saving = ref(false)
const showForm = ref(false)

// Edit state
const editingId = ref<string | null>(null)
const form = reactive({
  slug: '',
  label: '',
  description: '',
  price: 0,
  comparePrice: null as number | null,
  badge: null as string | null,
  position: 0,
  active: true,
  items: [] as { productId: string; quantity: number }[],
})

const showSuccess = (msg: string) => {
  success.value = msg
  setTimeout(() => { success.value = '' }, 3000)
}

const headers = () => ({ Authorization: `Bearer ${authStore.token}` })

const fetchData = async () => {
  loading.value = true
  error.value = ''
  try {
    const [b, p] = await Promise.all([
      apiFetch<Bundle[]>('/admin/bundles', { headers: headers() }),
      apiFetch<Product[]>('/admin/products', { headers: headers() }),
    ])
    bundles.value = b
    products.value = p
  } catch (e: any) {
    error.value = e?.data?.message || 'Erreur lors du chargement'
    if (e?.status === 401) authStore.logout()
  } finally {
    loading.value = false
  }
}

const slugify = (str: string) =>
  str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const openNew = () => {
  editingId.value = null
  form.slug = ''
  form.label = ''
  form.description = ''
  form.price = 0
  form.comparePrice = null
  form.badge = null
  form.position = bundles.value.length + 1
  form.active = true
  form.items = [{ productId: '', quantity: 1 }]
  showForm.value = true
}

const openEdit = (bundle: Bundle) => {
  editingId.value = bundle.id
  form.slug = bundle.slug
  form.label = bundle.label
  form.description = bundle.description
  form.price = bundle.price
  form.comparePrice = bundle.comparePrice
  form.badge = bundle.badge
  form.position = bundle.position
  form.active = bundle.active
  form.items = bundle.items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editingId.value = null
}

const addItem = () => form.items.push({ productId: '', quantity: 1 })
const removeItem = (idx: number) => form.items.splice(idx, 1)

const totalCost = computed(() =>
  form.items.reduce((sum, item) => {
    const prod = products.value.find((p) => p.id === item.productId)
    return sum + (prod?.costPrice || 0) * item.quantity
  }, 0),
)

const margin = computed(() => form.price - totalCost.value)

const saveBundle = async () => {
  saving.value = true
  error.value = ''
  try {
    const body = {
      slug: form.slug || slugify(form.label),
      label: form.label,
      description: form.description,
      price: form.price,
      comparePrice: form.comparePrice || null,
      badge: form.badge || null,
      position: form.position,
      active: form.active,
      items: form.items.filter((i) => i.productId),
    }
    if (editingId.value) {
      await apiFetch(`/admin/bundles/${editingId.value}`, { method: 'PUT', headers: headers(), body })
      showSuccess('Pack mis a jour')
    } else {
      await apiFetch('/admin/bundles', { method: 'POST', headers: headers(), body })
      showSuccess('Pack cree')
    }
    closeForm()
    await fetchData()
  } catch (e: any) {
    error.value = e?.data?.message || 'Erreur lors de la sauvegarde'
  } finally {
    saving.value = false
  }
}

const toggleActive = async (bundle: Bundle) => {
  try {
    await apiFetch(`/admin/bundles/${bundle.id}`, {
      method: 'PUT',
      headers: headers(),
      body: { active: !bundle.active },
    })
    bundle.active = !bundle.active
  } catch (e: any) {
    error.value = e?.data?.message || 'Erreur'
  }
}

const deleteBundle = async (bundle: Bundle) => {
  if (!confirm(`Supprimer le pack "${bundle.label}" ?`)) return
  try {
    await apiFetch(`/admin/bundles/${bundle.id}`, { method: 'DELETE', headers: headers() })
    bundles.value = bundles.value.filter((b) => b.id !== bundle.id)
    showSuccess('Pack supprime')
  } catch (e: any) {
    error.value = e?.data?.message || 'Erreur lors de la suppression'
  }
}

onMounted(fetchData)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-white tracking-tight">Packs</h1>
      <button
        v-if="!showForm"
        class="px-5 py-2 bg-brand hover:bg-brand-dark text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
        @click="openNew"
      >
        + Creer un pack
      </button>
    </div>

    <!-- Toasts -->
    <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="-translate-y-2 opacity-0" enter-to-class="translate-y-0 opacity-100" leave-active-class="transition-all duration-200 ease-in" leave-from-class="translate-y-0 opacity-100" leave-to-class="-translate-y-2 opacity-0">
      <div v-if="error" class="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{{ error }}</div>
    </Transition>
    <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="-translate-y-2 opacity-0" enter-to-class="translate-y-0 opacity-100" leave-active-class="transition-all duration-200 ease-in" leave-from-class="translate-y-0 opacity-100" leave-to-class="-translate-y-2 opacity-0">
      <div v-if="success" class="mb-5 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm">{{ success }}</div>
    </Transition>

    <!-- Loading -->
    <div v-if="loading" class="text-gray-400">Chargement...</div>

    <!-- Edit form -->
    <div v-if="showForm" class="mb-8 bg-white/[0.03] rounded-2xl p-6 space-y-5">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-semibold text-white">{{ editingId ? 'Modifier le pack' : 'Nouveau pack' }}</h2>
        <button class="text-gray-400 hover:text-white text-sm cursor-pointer" @click="closeForm">Annuler</button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Nom</label>
          <input v-model="form.label" type="text" placeholder="Kit Sport" class="w-full px-3 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand/50" @input="!editingId && (form.slug = slugify(form.label))" />
        </div>
        <div>
          <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Slug</label>
          <input v-model="form.slug" type="text" placeholder="sport" class="w-full px-3 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand/50" />
        </div>
        <div>
          <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Prix</label>
          <input v-model.number="form.price" type="number" step="0.01" min="0" class="w-full px-3 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand/50 tabular-nums" />
        </div>
        <div>
          <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Prix barre</label>
          <input v-model.number="form.comparePrice" type="number" step="0.01" min="0" class="w-full px-3 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand/50 tabular-nums" />
        </div>
        <div>
          <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Badge</label>
          <input v-model="form.badge" type="text" placeholder="-50%" class="w-full px-3 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand/50" />
        </div>
        <div>
          <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Position</label>
          <input v-model.number="form.position" type="number" min="0" class="w-full px-3 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand/50 tabular-nums" />
        </div>
      </div>

      <div>
        <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
        <input v-model="form.description" type="text" placeholder="ClipBag + Shaker Sport" class="w-full px-3 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand/50" />
      </div>

      <!-- Items -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <label class="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Contenu du pack</label>
          <button type="button" class="text-xs text-brand hover:text-brand-light cursor-pointer" @click="addItem">+ Ajouter</button>
        </div>
        <div class="space-y-2">
          <div v-for="(item, idx) in form.items" :key="idx" class="flex gap-3 items-center">
            <select v-model="form.items[idx].productId" class="flex-1 px-3 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand/50 [&>option]:bg-gray-900">
              <option value="" disabled>Choisir un produit</option>
              <option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }}{{ !p.active ? ' (inactif)' : '' }}</option>
            </select>
            <input v-model.number="form.items[idx].quantity" type="number" min="1" class="w-20 px-3 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white text-sm text-center focus:outline-none focus:ring-1 focus:ring-brand/50 tabular-nums" />
            <button v-if="form.items.length > 1" type="button" class="text-red-400/60 hover:text-red-400 cursor-pointer p-1" @click="removeItem(idx)">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <!-- Cost / Margin -->
        <div v-if="form.price > 0" class="flex items-center gap-4 mt-3 px-3 py-2 bg-white/[0.02] rounded-lg text-xs">
          <span class="text-gray-500">Cout achat: <span class="text-white tabular-nums">{{ totalCost.toFixed(2) }}EUR</span></span>
          <span class="text-gray-500">Marge: <span :class="[margin > 0 ? 'text-emerald-400' : 'text-red-400', 'tabular-nums']">{{ margin.toFixed(2) }}EUR</span></span>
        </div>
      </div>

      <!-- Active toggle + Save -->
      <div class="flex items-center justify-between pt-2">
        <label class="flex items-center gap-2 cursor-pointer">
          <input v-model="form.active" type="checkbox" class="w-4 h-4 rounded border-white/20 bg-white/5 text-brand focus:ring-brand/50 cursor-pointer" />
          <span class="text-sm text-gray-400">Actif</span>
        </label>
        <button :disabled="saving || !form.label" class="px-5 py-2 bg-brand hover:bg-brand-dark text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" @click="saveBundle">
          {{ saving ? 'Enregistrement...' : editingId ? 'Mettre a jour' : 'Creer' }}
        </button>
      </div>
    </div>

    <!-- Bundle cards -->
    <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div v-for="bundle in bundles" :key="bundle.id" :class="['bg-white/[0.03] rounded-2xl p-5 border transition-colors', bundle.active ? 'border-white/[0.06]' : 'border-red-500/20 opacity-60']">
        <div class="flex items-start justify-between mb-3">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-white font-semibold">{{ bundle.label }}</h3>
              <span v-if="bundle.badge" class="text-urgency text-[10px] font-bold uppercase">{{ bundle.badge }}</span>
            </div>
            <p class="text-xs text-gray-500 mt-0.5">{{ bundle.slug }} · position {{ bundle.position }}</p>
          </div>
          <div class="text-right">
            <div class="text-white font-semibold tabular-nums">{{ bundle.price.toFixed(2) }}EUR</div>
            <div v-if="bundle.comparePrice" class="text-xs text-gray-500 line-through tabular-nums">{{ bundle.comparePrice.toFixed(2) }}EUR</div>
          </div>
        </div>

        <div class="mb-4 space-y-1">
          <div v-for="item in bundle.items" :key="item.id" class="flex items-center gap-2 text-xs text-gray-400">
            <span class="text-white/60">{{ item.quantity }}x</span>
            <span>{{ item.product.name }}</span>
          </div>
        </div>

        <div class="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
          <button class="text-xs text-brand hover:text-brand-light cursor-pointer" @click="openEdit(bundle)">Modifier</button>
          <button class="text-xs cursor-pointer" :class="bundle.active ? 'text-orange-400 hover:text-orange-300' : 'text-emerald-400 hover:text-emerald-300'" @click="toggleActive(bundle)">
            {{ bundle.active ? 'Desactiver' : 'Activer' }}
          </button>
          <button class="text-xs text-red-400/60 hover:text-red-400 cursor-pointer ml-auto" @click="deleteBundle(bundle)">Supprimer</button>
        </div>
      </div>
    </div>

    <div v-if="!loading && bundles.length === 0" class="text-center py-12 text-gray-500">
      <p class="text-sm">Aucun pack configure</p>
    </div>
  </div>
</template>
