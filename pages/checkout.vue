<script setup lang="ts">
import { useCartStore } from '~/store/cart'
import { useCurrencyStore } from '~/store/currency'

definePageMeta({
  layout: 'check',
})

const cartStore = useCartStore()
const currencyStore = useCurrencyStore()
const router = useRouter()
const isPlacingOrder = ref(false)

function getCartItemDetails(item: any) {
  if (!item.shop_part_details_list || item.shop_part_details_list.length === 0)
    return null
  return item.shop_part_details_list.find((d: any) => d.sales_area === currencyStore.sales_area) || item.shop_part_details_list[0]
}

function placeOrder() {
  isPlacingOrder.value = true
  setTimeout(() => {
    isPlacingOrder.value = false
    cartStore.clearCart()
    router.push('/completed') // Redirect to a success page
  }, 1500)
}
</script>

<template>
  <div class="checkout-container">
    <div v-if="cartStore.items.length > 0" class="checkout-card">
      <h1 class="text-3xl font-bold mb-6">
        Order Summary
      </h1>
      <div class="space-y-4">
        <div v-for="item in cartStore.items" :key="item.id" class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <img :src="item.img.split(',')[0]" :alt="item.name" class="w-16 h-16 object-cover rounded-md">
            <div>
              <p class="font-semibold">
                {{ item.name }}
              </p>
              <p class="text-sm text-gray-500">
                Quantity: {{ item.quantity }}
              </p>
            </div>
          </div>
          <p class="font-semibold">
            {{ currencyStore.currencySymbol }}{{ (Number(getCartItemDetails(item)?.price) * item.quantity).toFixed(2) }}
          </p>
        </div>
      </div>
      <div class="mt-8 pt-4 border-t">
        <div class="flex justify-between items-center text-lg font-semibold">
          <span>Subtotal</span>
          <span>{{ currencyStore.currencySymbol }}{{ cartStore.subtotal.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between items-center text-lg font-semibold mt-2">
          <span>Shipping (Mock)</span>
          <span>{{ currencyStore.currencySymbol }}5.00</span>
        </div>
        <div class="flex justify-between items-center text-2xl font-bold mt-4">
          <span>Total</span>
          <span>{{ currencyStore.currencySymbol }}{{ (cartStore.subtotal + 5).toFixed(2) }}</span>
        </div>
      </div>
      <button
        class="w-full mt-8 py-3 rounded-md font-semibold text-white transition-colors"
        :disabled="isPlacingOrder"
        :class="isPlacingOrder ? 'bg-gray-400 cursor-not-allowed' : 'bg-sky-500 hover:bg-sky-600'"
        @click="placeOrder"
      >
        <span v-if="isPlacingOrder">Placing Order...</span>
        <span v-else>Place Mock Order</span>
      </button>
    </div>
    <div v-else class="empty-cart-container">
      <icon name="carbon:shopping-cart-plus" class="icon" />
      <h1>Your Cart is Empty</h1>
      <p>Looks like you haven't added anything to your cart yet.</p>
      <NuxtLink to="/store" class="home-link">
        Continue Shopping
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.checkout-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 4rem 2rem;
  min-height: 80vh;
  background-color: #f9fafb;
}
.checkout-card {
  width: 100%;
  max-width: 600px;
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
.empty-cart-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
  text-align: center;
  font-family: "Roboto", sans-serif;
}
.icon {
  font-size: 6rem;
  color: #a0aec0;
  margin-bottom: 1.5rem;
}
h1 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #1a202c;
}
p {
  font-size: 1.125rem;
  color: #718096;
  margin-bottom: 2.5rem;
}
.home-link {
  display: inline-block;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 500;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 6px;
  text-decoration: none;
  transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;
}
.home-link:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}
</style>
