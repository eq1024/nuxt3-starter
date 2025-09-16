import { ref } from 'vue'

const isCartVisible = ref(false)

export function useCartDrawer() {
  const openCart = () => {
    isCartVisible.value = true
  }

  const closeCart = () => {
    isCartVisible.value = false
  }

  return {
    isCartVisible,
    openCart,
    closeCart,
  }
}
