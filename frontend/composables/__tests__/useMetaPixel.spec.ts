import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useMetaPixel } from '../useMetaPixel'

describe('useMetaPixel', () => {
  let mockFbq: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockFbq = vi.fn()
  })

  afterEach(() => {
    delete (window as any).fbq
  })

  it('track() should call window.fbq with event and params', () => {
    ;(window as any).fbq = mockFbq

    const { track } = useMetaPixel()
    track('AddToCart', { content_name: 'Mon Produit', value: 29.99, currency: 'EUR' })

    expect(mockFbq).toHaveBeenCalledWith('track', 'AddToCart', {
      content_name: 'Mon Produit',
      value: 29.99,
      currency: 'EUR',
    })
  })

  it('track() should not crash when window.fbq is undefined', () => {
    delete (window as any).fbq

    const { track } = useMetaPixel()

    expect(() => track('PageView')).not.toThrow()
  })

  it('track() should not crash when called without params', () => {
    ;(window as any).fbq = mockFbq

    const { track } = useMetaPixel()
    track('ViewContent')

    expect(mockFbq).toHaveBeenCalledWith('track', 'ViewContent', undefined)
  })

  it('track() should pass params correctly to fbq', () => {
    ;(window as any).fbq = mockFbq

    const { track } = useMetaPixel()
    const params = {
      content_ids: ['prod-1'],
      content_type: 'product',
      num_items: 2,
      value: 49.99,
      currency: 'EUR',
    }
    track('InitiateCheckout', params)

    expect(mockFbq).toHaveBeenCalledWith('track', 'InitiateCheckout', params)
  })

  it('track() should handle fbq being null gracefully', () => {
    ;(window as any).fbq = null

    const { track } = useMetaPixel()

    expect(() => track('Purchase', { value: 29.99 })).not.toThrow()
  })
})
