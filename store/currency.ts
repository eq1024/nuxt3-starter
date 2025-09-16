import { defineStore } from 'pinia'
import { useCartStore } from './cart'

export const useCurrencyStore = defineStore('currency', {
  state: () => ({
    sales_area: 1, // 1: US, 2: EU, 3: UK, 4: JP, 5: CN
  }),
  getters: {
    currencySymbol(state): string {
      switch (state.sales_area) {
        case 2:
          return '€' // Euro
        case 3:
          return '£' // Pound
        case 4:
          return '¥' // Yen
        case 5:
          return '¥' // Yuan
        case 1:
        default:
          return '$' // Dollar
      }
    },
  },
  actions: {
    setSalesArea(newSalesArea: number) {
      if (this.sales_area !== newSalesArea) {
        const cartStore = useCartStore()
        cartStore.clearCart()
        this.sales_area = newSalesArea
      }
    },
  },
  persist: true,
})
