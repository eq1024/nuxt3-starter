import { defineStore } from 'pinia'

type PartInfo = App.Part['parts_info']

export interface CartItem extends PartInfo {
  quantity: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [
      {
        id: 1,
        name: 'Premium Replacement Screen for Model X',
        description: 'High-quality, pixel-perfect replacement screen.',
        img: 'https://images.unsplash.com/photo-1588881992033-AC24d375c87b?q=80&w=2070&auto=format&fit=crop',
        compatibility: 'Model X, Model X Pro',
        shop_part_details_list: [
          { id: 1, part_id: 1, sales_area: 1, price: '69.99', sku: 'SKU-MX-SCR-US', status: 1 },
        ],
        quantity: 1,
      },
      {
        id: 2,
        name: 'Long-Life Battery for Model Y',
        description: 'Boost your device\'s life with our extended-capacity battery.',
        img: 'https://images.unsplash.com/photo-1599427322692-3c142d241150?q=80&w=1935&auto=format&fit=crop',
        compatibility: 'Model Y (All versions)',
        shop_part_details_list: [
          { id: 3, part_id: 2, sales_area: 1, price: '49.99', sku: 'SKU-MY-BAT-US', status: 1 },
        ],
        quantity: 2,
      },
    ] as CartItem[],
  }),

  getters: {
    cartCount: state => state.items.reduce((total, item) => total + item.quantity, 0),
    subtotal: (state) => {
      return state.items.reduce((total, item) => {
        const price = Number(item.shop_part_details_list[0]?.price || 0)
        return total + (price * item.quantity)
      }, 0)
    },
  },

  actions: {
    addItem(item: PartInfo) {
      const existingItem = this.items.find(i => i.id === item.id)
      if (existingItem) {
        existingItem.quantity++
      }
      else {
        this.items.push({ ...item, quantity: 1 })
      }
    },
    removeItem(itemId: number) {
      this.items = this.items.filter(item => item.id !== itemId)
    },
    incrementQuantity(itemId: number) {
      const item = this.items.find(i => i.id === itemId)
      if (item)
        item.quantity++
    },
    decrementQuantity(itemId: number) {
      const item = this.items.find(i => i.id === itemId)
      if (item && item.quantity > 1)
        item.quantity--
    },
    setQuantity(itemId: number, quantity: number) {
      const item = this.items.find(i => i.id === itemId)
      if (item)
        item.quantity = quantity
    },
    clearCart() {
      this.items = []
    },
    updateItemPrice(partId: number, sku: string, newPrice: string) {
      const item = this.items.find(i =>
        i.id === partId && i.shop_part_details_list.some(d => d.sku === sku),
      )
      if (item) {
        const detail = item.shop_part_details_list.find(d => d.sku === sku)
        if (detail)
          detail.price = newPrice
      }
    },
  },
  persist: true,
})
