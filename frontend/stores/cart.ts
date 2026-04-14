import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    quantity: 1,
    selectedColor: 'black',
  }),
  actions: {
    setQuantity(qty: number) {
      this.quantity = Math.max(1, Math.min(10, qty))
    },
    setColor(color: string) {
      this.selectedColor = color
    },
  },
})
