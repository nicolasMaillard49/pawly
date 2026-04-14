import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProductStore } from '../product'

// Mock useApi which is auto-imported by Nuxt
const mockApiFetch = vi.fn()
vi.stubGlobal('useApi', () => ({ apiFetch: mockApiFetch }))

describe('useProductStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockApiFetch.mockReset()
  })

  it('fetchProduct() loads the product from API', async () => {
    const fakeProduct = {
      id: '1',
      name: 'Test Product',
      slug: 'test-product',
      description: 'A test product',
      price: 29.99,
      comparePrice: 39.99,
      images: ['img1.jpg'],
      variants: null,
      active: true,
    }
    mockApiFetch.mockResolvedValue([fakeProduct])

    const store = useProductStore()
    expect(store.loading).toBe(false)
    expect(store.product).toBeNull()

    await store.fetchProduct()

    expect(mockApiFetch).toHaveBeenCalledWith('/products')
    expect(store.product).toEqual(fakeProduct)
    expect(store.loading).toBe(false)
  })

  it('fetchProduct() sets product to null when API returns empty array', async () => {
    mockApiFetch.mockResolvedValue([])

    const store = useProductStore()
    await store.fetchProduct()

    expect(store.product).toBeNull()
    expect(store.loading).toBe(false)
  })

  it('fetchProduct() sets loading to false even on error', async () => {
    mockApiFetch.mockRejectedValue(new Error('Network error'))

    const store = useProductStore()

    await expect(store.fetchProduct()).rejects.toThrow('Network error')
    expect(store.loading).toBe(false)
  })

  it('fetchProduct() should handle network timeout', async () => {
    mockApiFetch.mockRejectedValue(new Error('timeout'))

    const store = useProductStore()

    await expect(store.fetchProduct()).rejects.toThrow('timeout')
    expect(store.product).toBeNull()
    expect(store.loading).toBe(false)
  })

  it('fetchProduct() should handle undefined API response', async () => {
    mockApiFetch.mockResolvedValue(undefined)

    const store = useProductStore()

    // undefined[0] throws, so fetchProduct should throw
    await expect(store.fetchProduct()).rejects.toThrow()
    expect(store.loading).toBe(false)
  })

  it('fetchProduct() should set loading to true during fetch', async () => {
    let resolvePromise: (value: any) => void
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve
    })
    mockApiFetch.mockReturnValue(pendingPromise)

    const store = useProductStore()
    const fetchPromise = store.fetchProduct()

    // loading should be true while waiting
    expect(store.loading).toBe(true)

    // Resolve and check loading goes back to false
    resolvePromise!([{ id: '1', name: 'Test' }])
    await fetchPromise
    expect(store.loading).toBe(false)
  })
})
