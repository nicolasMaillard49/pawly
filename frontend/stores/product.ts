import { defineStore } from 'pinia'

interface ProductVariants {
  colors: { name: string; value: string }[]
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice: number | null
  images: string[]
  stripeImage: string | null
  orderImage: string | null
  variants: ProductVariants | null
  active: boolean
}

interface BundleItem {
  id: string
  productId: string
  quantity: number
  product: { id: string; name: string; images: string[] }
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

export type { Product, Bundle, BundleItem }

export const useProductStore = defineStore('product', {
  state: () => ({
    product: null as Product | null,
    bundles: [] as Bundle[],
    loading: false,
  }),
  actions: {
    async fetchProduct() {
      this.loading = true
      const { apiFetch } = useApi()
      try {
        const products = await apiFetch<Product[]>('/products')
        this.product = products[0] || null
      } finally {
        this.loading = false
      }
    },
    async fetchBundles() {
      const { apiFetch } = useApi()
      this.bundles = await apiFetch<Bundle[]>('/bundles')
    },
  },
})
