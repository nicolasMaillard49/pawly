import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useApi } from '../useApi'

// Mock useRuntimeConfig (auto-imported by Nuxt)
vi.stubGlobal('useRuntimeConfig', () => ({
  public: { apiBase: 'http://localhost:3001/api' },
}))

// Mock $fetch (Nuxt global)
const mock$fetch = vi.fn()
vi.stubGlobal('$fetch', mock$fetch)

describe('useApi', () => {
  beforeEach(() => {
    mock$fetch.mockReset()
  })

  it('apiFetch() calls $fetch with the correct full URL', async () => {
    const fakeData = { id: 1, name: 'Product' }
    mock$fetch.mockResolvedValue(fakeData)

    const { apiFetch } = useApi()
    const result = await apiFetch('/products')

    expect(mock$fetch).toHaveBeenCalledWith(
      'http://localhost:3001/api/products',
      undefined,
    )
    expect(result).toEqual(fakeData)
  })

  it('apiFetch() passes options through to $fetch', async () => {
    mock$fetch.mockResolvedValue({})

    const { apiFetch } = useApi()
    const options = { method: 'POST', body: { name: 'test' } }
    await apiFetch('/products', options)

    expect(mock$fetch).toHaveBeenCalledWith(
      'http://localhost:3001/api/products',
      options,
    )
  })

  it('apiFetch() propagates errors from $fetch', async () => {
    mock$fetch.mockRejectedValue(new Error('500 Internal Server Error'))

    const { apiFetch } = useApi()

    await expect(apiFetch('/products')).rejects.toThrow('500 Internal Server Error')
  })
})
