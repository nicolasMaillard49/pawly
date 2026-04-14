import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '../cart'

describe('useCartStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with quantity=1 and color=black', () => {
    const store = useCartStore()
    expect(store.quantity).toBe(1)
    expect(store.selectedColor).toBe('black')
  })

  it('setQuantity(5) should update quantity', () => {
    const store = useCartStore()
    store.setQuantity(5)
    expect(store.quantity).toBe(5)
  })

  it('setQuantity(0) should clamp to 1 (min)', () => {
    const store = useCartStore()
    store.setQuantity(0)
    expect(store.quantity).toBe(1)
  })

  it('setQuantity(15) should clamp to 10 (max)', () => {
    const store = useCartStore()
    store.setQuantity(15)
    expect(store.quantity).toBe(10)
  })

  it('setQuantity(-1) should clamp to 1', () => {
    const store = useCartStore()
    store.setQuantity(-1)
    expect(store.quantity).toBe(1)
  })

  it('setColor should update selectedColor', () => {
    const store = useCartStore()
    store.setColor('red')
    expect(store.selectedColor).toBe('red')
  })
})
