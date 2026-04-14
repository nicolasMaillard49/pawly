<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

interface Product {
  id: string
  name: string
  description: string
  price: number
  comparePrice: number | null
  costPrice: number
  images: string[]
  stripeImage: string | null
  orderImage: string | null
  supplierUrl: string | null
}

interface ProductListItem {
  id: string
  name: string
  slug: string
  active: boolean
}

const { apiFetch } = useApi()
const authStore = useAuthStore()

const productList = ref<ProductListItem[]>([])
const selectedProductId = ref('')
const product = ref<Product | null>(null)
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const success = ref('')

const form = reactive({
  name: '',
  description: '',
  price: 0,
  comparePrice: 0,
  costPrice: 0,
  images: [] as string[],
  stripeImage: '',
  orderImage: '',
  supplierUrl: '',
  socialVideos: [] as { url: string; title: string; thumbnail: string }[],
})

const fetchProductList = async () => {
  try {
    productList.value = await apiFetch<ProductListItem[]>('/admin/products', {
      headers: { Authorization: `Bearer ${authStore.token}` },
    })
  } catch (e: any) {
    if (e?.status === 401) authStore.logout()
  }
}

const fetchProduct = async (id?: string) => {
  loading.value = true
  error.value = ''
  try {
    const query = id ? `?id=${id}` : ''
    product.value = await apiFetch<Product>(`/admin/product${query}`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    })
    selectedProductId.value = product.value.id
    form.name = product.value.name
    form.description = product.value.description
    form.price = product.value.price
    form.comparePrice = product.value.comparePrice || 0
    form.costPrice = product.value.costPrice || 0
    form.images = [...product.value.images]
    form.stripeImage = product.value.stripeImage || ''
    form.orderImage = product.value.orderImage || ''
    form.supplierUrl = product.value.supplierUrl || ''
    const saved = localStorage.getItem('clipbag_social_videos')
    if (saved) {
      form.socialVideos = JSON.parse(saved)
    }
  } catch (e: any) {
    error.value = e?.data?.message || 'Erreur lors du chargement du produit'
    if (e?.status === 401) authStore.logout()
  } finally {
    loading.value = false
  }
}

const switchProduct = (id: string) => {
  if (id !== product.value?.id) fetchProduct(id)
}

const addImage = () => { form.images.push('') }
const removeImage = (idx: number) => { form.images.splice(idx, 1) }
const moveImageUp = (idx: number) => {
  if (idx <= 0) return
  const arr = form.images
  ;[arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]]
}
const moveImageDown = (idx: number) => {
  if (idx >= form.images.length - 1) return
  const arr = form.images
  ;[arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]]
}

const addVideo = () => { form.socialVideos.push({ url: '', title: '', thumbnail: '' }) }
const removeVideo = (idx: number) => { form.socialVideos.splice(idx, 1) }
const saveSocialVideos = () => {
  localStorage.setItem('clipbag_social_videos', JSON.stringify(form.socialVideos))
}

const saveProduct = async () => {
  if (!product.value) return
  saving.value = true
  error.value = ''
  success.value = ''
  try {
    const cleanImages = form.images.filter((img) => img.trim() !== '')
    await apiFetch(`/admin/product/${product.value.id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: {
        name: form.name,
        description: form.description,
        price: form.price,
        comparePrice: form.comparePrice || null,
        costPrice: form.costPrice,
        images: cleanImages,
        stripeImage: form.stripeImage || null,
        orderImage: form.orderImage || null,
        supplierUrl: form.supplierUrl || null,
      },
    })
    saveSocialVideos()
    success.value = 'Produit mis a jour avec succes'
    setTimeout(() => { success.value = '' }, 3000)
  } catch (e: any) {
    error.value = e?.data?.message || 'Erreur lors de la sauvegarde'
    if (e?.status === 401) authStore.logout()
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await fetchProductList()
  await fetchProduct()
})
</script>

<template>
  <div>
    <!-- Header + Save -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <h1 class="text-2xl font-bold text-white tracking-tight">Modifier le produit</h1>
        <select
          v-if="productList.length > 1"
          :value="selectedProductId"
          class="bg-white/[0.05] border border-white/10 rounded-lg text-white text-sm px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand/50 cursor-pointer"
          @change="switchProduct(($event.target as HTMLSelectElement).value)"
        >
          <option v-for="p in productList" :key="p.id" :value="p.id" class="bg-[#1a1a2e] text-white">
            {{ p.name }}{{ !p.active ? ' (inactif)' : '' }}
          </option>
        </select>
      </div>
      <button
        v-if="product && !loading"
        :disabled="saving"
        class="px-5 py-2 bg-brand hover:bg-brand-dark text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
        @click="saveProduct"
      >
        <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
      </button>
    </div>

    <!-- Toasts -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="-translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-2 opacity-0"
    >
      <div v-if="error" class="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
        <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9.303 3.376A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        {{ error }}
      </div>
    </Transition>
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="-translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-2 opacity-0"
    >
      <div v-if="success" class="mb-5 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
        <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        {{ success }}
      </div>
    </Transition>

    <!-- Loading skeleton -->
    <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div class="lg:col-span-3 space-y-4">
        <div class="h-64 bg-white/[0.03] rounded-2xl animate-pulse" />
        <div class="h-48 bg-white/[0.03] rounded-2xl animate-pulse" />
      </div>
      <div class="lg:col-span-2 space-y-4">
        <div class="h-40 bg-white/[0.03] rounded-2xl animate-pulse" />
        <div class="h-32 bg-white/[0.03] rounded-2xl animate-pulse" />
      </div>
    </div>

    <!-- Form -->
    <form v-else-if="product" class="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start" @submit.prevent="saveProduct">

      <!-- ═══════ LEFT COLUMN (3/5) ═══════ -->
      <div class="lg:col-span-3 space-y-5">

        <!-- Informations -->
        <div class="bg-white/[0.03] rounded-2xl p-5 space-y-4">
          <h2 class="text-sm font-semibold text-white tracking-wide">Informations</h2>

          <div>
            <label for="product-name" class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Nom du produit</label>
            <input
              id="product-name"
              v-model="form.name"
              type="text"
              required
              class="w-full px-3 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-brand/50 transition-colors"
            />
          </div>

          <div>
            <label for="product-description" class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
            <textarea
              id="product-description"
              v-model="form.description"
              rows="4"
              required
              class="w-full px-3 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-brand/50 transition-colors resize-y"
            />
          </div>
        </div>

        <!-- Images galerie -->
        <div class="bg-white/[0.03] rounded-2xl p-5 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-semibold text-white tracking-wide">Images galerie</h2>
            <button
              type="button"
              class="text-xs text-brand hover:text-brand-light transition-colors cursor-pointer flex items-center gap-1"
              @click="addImage"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
              Ajouter
            </button>
          </div>

          <!-- Image grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            <div
              v-for="(img, idx) in form.images"
              :key="idx"
              class="group relative bg-white/[0.03] rounded-xl border border-white/[0.06] overflow-hidden"
            >
              <!-- Preview -->
              <div class="aspect-square bg-white/[0.02]">
                <img
                  v-if="form.images[idx]"
                  :src="form.images[idx]"
                  class="w-full h-full object-cover"
                  :alt="`Image ${idx + 1}`"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-700">
                  <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
                </div>
              </div>

              <!-- Index badge -->
              <span class="absolute top-1.5 left-1.5 bg-black/60 text-white text-[10px] font-bold w-5 h-5 rounded-md flex items-center justify-center">
                {{ idx + 1 }}
              </span>

              <!-- Reorder + delete controls -->
              <div class="absolute top-1.5 right-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  :disabled="idx === 0"
                  class="bg-black/60 hover:bg-white/20 text-white/70 hover:text-white w-5 h-5 rounded-md flex items-center justify-center transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Monter"
                  @click="moveImageUp(idx)"
                >
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" /></svg>
                </button>
                <button
                  type="button"
                  :disabled="idx === form.images.length - 1"
                  class="bg-black/60 hover:bg-white/20 text-white/70 hover:text-white w-5 h-5 rounded-md flex items-center justify-center transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Descendre"
                  @click="moveImageDown(idx)"
                >
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                <button
                  type="button"
                  class="bg-black/60 hover:bg-red-500/80 text-white/70 hover:text-white w-5 h-5 rounded-md flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Supprimer"
                  @click="removeImage(idx)"
                >
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <!-- Input -->
              <div class="p-2">
                <input
                  v-model="form.images[idx]"
                  type="text"
                  placeholder="/images/product/..."
                  class="w-full px-2 py-1 bg-white/[0.05] border border-white/[0.08] rounded text-white text-[11px] placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-brand/40 transition-colors"
                />
              </div>
            </div>

            <!-- Add placeholder card -->
            <button
              type="button"
              class="aspect-square rounded-xl border-2 border-dashed border-white/[0.08] hover:border-brand/30 flex flex-col items-center justify-center gap-2 text-gray-600 hover:text-brand/60 transition-colors cursor-pointer"
              @click="addImage"
            >
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
              <span class="text-[10px] font-medium uppercase tracking-wider">Ajouter</span>
            </button>
          </div>

          <p class="text-[10px] text-gray-600">Premiere image = image principale (hero). Utilisez les fleches haut/bas pour reorganiser l'ordre du carrousel.</p>
        </div>

        <!-- Videos -->
        <div class="bg-white/[0.03] rounded-2xl p-5 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-semibold text-white tracking-wide">Videos reseaux sociaux</h2>
            <button
              type="button"
              class="text-xs text-brand hover:text-brand-light transition-colors cursor-pointer flex items-center gap-1"
              @click="addVideo"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
              Ajouter
            </button>
          </div>

          <div class="grid grid-cols-1 xl:grid-cols-2 gap-3">
            <div v-for="(video, idx) in form.socialVideos" :key="idx" class="bg-white/[0.02] rounded-xl p-3 border border-white/[0.05] space-y-2.5">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-medium text-gray-400">Video {{ idx + 1 }}</span>
                <button
                  type="button"
                  class="text-red-400/60 hover:text-red-400 text-[11px] transition-colors cursor-pointer"
                  @click="removeVideo(idx)"
                >
                  Supprimer
                </button>
              </div>
              <input
                v-model="form.socialVideos[idx].url"
                type="url"
                placeholder="URL TikTok / Instagram / YouTube"
                class="w-full px-2.5 py-1.5 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white text-xs placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-brand/40 transition-colors"
              />
              <div class="flex gap-2">
                <input
                  v-model="form.socialVideos[idx].title"
                  type="text"
                  placeholder="Titre"
                  class="flex-1 px-2.5 py-1.5 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white text-xs placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-brand/40 transition-colors"
                />
                <input
                  v-model="form.socialVideos[idx].thumbnail"
                  type="text"
                  placeholder="Miniature"
                  class="w-28 px-2.5 py-1.5 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white text-xs placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-brand/40 transition-colors"
                />
              </div>
            </div>
          </div>

          <div v-if="form.socialVideos.length === 0" class="text-center py-6">
            <p class="text-xs text-gray-600">Aucune video</p>
          </div>
        </div>
      </div>

      <!-- ═══════ RIGHT COLUMN (2/5) ═══════ -->
      <div class="lg:col-span-2 space-y-5">

        <!-- Tarification -->
        <div class="bg-white/[0.03] rounded-2xl p-5 space-y-4">
          <h2 class="text-sm font-semibold text-white tracking-wide">Tarification</h2>

          <div class="grid grid-cols-3 gap-3">
            <div>
              <label for="product-price" class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Prix</label>
              <div class="relative">
                <input
                  id="product-price"
                  v-model.number="form.price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  class="w-full pl-3 pr-7 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand/50 transition-colors tabular-nums"
                />
                <span class="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-600">EUR</span>
              </div>
            </div>
            <div>
              <label for="product-compare-price" class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Barre</label>
              <div class="relative">
                <input
                  id="product-compare-price"
                  v-model.number="form.comparePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  class="w-full pl-3 pr-7 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand/50 transition-colors tabular-nums"
                />
                <span class="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-600">EUR</span>
              </div>
            </div>
            <div>
              <label for="cost-price" class="block text-[11px] font-medium text-orange-400/80 uppercase tracking-wider mb-1.5">Achat</label>
              <div class="relative">
                <input
                  id="cost-price"
                  v-model.number="form.costPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  class="w-full pl-3 pr-7 py-2 bg-white/[0.05] border border-orange-500/20 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-orange-500/50 transition-colors tabular-nums"
                  placeholder="12"
                />
                <span class="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-600">EUR</span>
              </div>
            </div>
          </div>

          <!-- Margin preview -->
          <div v-if="form.price > 0 && form.costPrice > 0" class="flex items-center gap-2 px-3 py-2 bg-white/[0.02] rounded-lg">
            <span class="text-[11px] text-gray-500">Marge brute :</span>
            <span class="text-xs font-medium" :class="form.price - form.costPrice > 0 ? 'text-emerald-400' : 'text-red-400'">
              {{ (form.price - form.costPrice).toFixed(2) }}EUR
            </span>
            <span class="text-[11px] text-gray-600">({{ Math.round(((form.price - form.costPrice) / form.price) * 100) }}%)</span>
          </div>
        </div>

        <!-- Fournisseur -->
        <div class="bg-white/[0.03] rounded-2xl p-5 border border-orange-500/10 space-y-4">
          <h2 class="text-sm font-semibold text-orange-400 tracking-wide">Fournisseur</h2>

          <div>
            <label for="supplier-url" class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Lien AliExpress</label>
            <input
              id="supplier-url"
              v-model="form.supplierUrl"
              type="url"
              placeholder="https://aliexpress.com/item/..."
              class="w-full px-3 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-orange-500/50 transition-colors"
            />
          </div>

          <a
            v-if="form.supplierUrl"
            :href="form.supplierUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 text-[11px] text-orange-400/70 hover:text-orange-400 transition-colors"
          >
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
            Ouvrir sur AliExpress
          </a>
        </div>

        <!-- Images specifiques -->
        <div class="bg-white/[0.03] rounded-2xl p-5 space-y-4">
          <h2 class="text-sm font-semibold text-white tracking-wide">Images specifiques</h2>
          <p class="text-[10px] text-gray-600">Overrides l'image principale pour ces emplacements.</p>

          <!-- Stripe -->
          <div>
            <label for="stripe-image" class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Page paiement Stripe</label>
            <div class="flex items-center gap-2">
              <input
                id="stripe-image"
                v-model="form.stripeImage"
                type="text"
                placeholder="Laisser vide = image principale"
                class="flex-1 px-3 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white text-xs placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-brand/40 transition-colors"
              />
              <div class="w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-white/[0.02]">
                <img v-if="form.stripeImage" :src="form.stripeImage" class="w-full h-full object-cover" />
                <img v-else-if="form.images[0]" :src="form.images[0]" class="w-full h-full object-cover opacity-40" />
              </div>
            </div>
            <p class="text-[10px] text-gray-600 mt-1">URL publique requise en prod (https://...)</p>
          </div>

          <!-- Order -->
          <div>
            <label for="order-image" class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Section Commander</label>
            <div class="flex items-center gap-2">
              <input
                id="order-image"
                v-model="form.orderImage"
                type="text"
                placeholder="Laisser vide = image principale"
                class="flex-1 px-3 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white text-xs placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-brand/40 transition-colors"
              />
              <div class="w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-white/[0.02]">
                <img v-if="form.orderImage" :src="form.orderImage" class="w-full h-full object-cover" />
                <img v-else-if="form.images[0]" :src="form.images[0]" class="w-full h-full object-cover opacity-40" />
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile save button -->
        <button
          type="submit"
          :disabled="saving"
          class="lg:hidden w-full py-3 bg-brand hover:bg-brand-dark text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {{ saving ? 'Enregistrement...' : 'Enregistrer les modifications' }}
        </button>
      </div>
    </form>
  </div>
</template>
