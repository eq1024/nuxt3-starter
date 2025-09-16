<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import { computed, ref, watch } from 'vue'
import { useCartDrawer } from '~/composables/useCartDrawer'
import { useCartStore } from '~/store/cart'
import { useCurrencyStore } from '~/store/currency'

const { isCartVisible, closeCart } = useCartDrawer()
const cartStore = useCartStore()
const currencyStore = useCurrencyStore()
const router = useRouter()

const showOutOfStockDialog = ref(false)
const unavailableItems = ref<any[]>([])
const isCheckingStock = ref(false)

watch(isCartVisible, (newValue) => {
  if (newValue && cartStore.items.length > 0)
    checkStock()
})

async function checkStock() {
  isCheckingStock.value = true
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 500))
  // In our mock environment, items are always in stock.
  unavailableItems.value = []
  isCheckingStock.value = false
}

async function handleCheckout() {
  if (cartStore.cartCount === 0)
    return

  await checkStock()

  if (unavailableItems.value.length > 0) {
    showOutOfStockDialog.value = true
  }
  else {
    proceedToCheckout()
  }
}

function proceedToCheckout() {
  if (cartStore.cartCount > 0) {
    closeCart()
    router.push('/checkout')
  }
}

function confirmContinueCheckout() {
  const unavailableKeys = new Set(unavailableItems.value.map(item => `${item.part_id}-${item.sku}`))
  cartStore.items.forEach((item) => {
    const itemSku = getCartItemDetails(item)?.sku
    const itemKey = `${item.id}-${itemSku}`
    if (itemSku && unavailableKeys.has(itemKey))
      cartStore.removeItem(item.id)
  })
  showOutOfStockDialog.value = false
  proceedToCheckout()
}

const outOfStockDialogItems = computed(() => {
  const unavailableKeys = new Set(unavailableItems.value.map(item => `${item.part_id}-${item.sku}`))
  return cartStore.items.filter((item) => {
    const itemSku = getCartItemDetails(item)?.sku
    const itemKey = `${item.id}-${itemSku}`
    return unavailableKeys.has(itemKey)
  })
})

function getCartItemDetails(item: App.Part['parts_info']) {
  if (!item.shop_part_details_list || item.shop_part_details_list.length === 0)
    return null
  return item.shop_part_details_list.find(d => d.sales_area === currencyStore.sales_area) || item.shop_part_details_list[0]
}

function handleQuantityUpdate(itemId: number, newQuantity: string | number) {
  const quantity = Math.floor(Number(newQuantity))

  if (quantity > 0) {
    cartStore.setQuantity(itemId, quantity)
  }
  else {
    ElMessageBox.confirm(
      'Are you sure you want to remove this item from the cart?',
      'Confirm Deletion',
      {
        confirmButtonText: 'Remove',
        cancelButtonText: 'Cancel',
        type: 'warning',
      },
    )
      .then(() => {
        cartStore.removeItem(itemId)
      })
      .catch(() => {
        // If the user cancels, reset the quantity to 1
        const item = cartStore.items.find(i => i.id === itemId)
        if (item)
          cartStore.setQuantity(itemId, 1)
      })
  }
}
</script>

<template>
  <!-- Cart Drawer -->
  <el-drawer v-model="isCartVisible" :with-header="false" :lock-scroll="false" size="500px">
    <div class="flex flex-col h-full">
      <div v-loading="isCheckingStock" class="flex flex-col h-full">
        <div class="flex justify-between items-center p-4 pt-0 border-b">
          <h2 class="text-xl font-semibold">
            {{ $t('cart.title', { count: cartStore.cartCount }) }}
          </h2>
          <el-button class="text-2xl text-gray-500 hover:text-gray-800" @click="closeCart">
            <Icon name="carbon:close" class="font-600" />
          </el-button>
        </div>

        <div class="flex-grow overflow-y-auto p-4">
          <div v-if="cartStore.items.length === 0" class="text-center text-gray-500">
            {{ $t('cart.empty') }}
          </div>
          <div v-else>
            <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
              <NuxtLink :to="`/store/${item.id}`" class="cursor-pointer" @click="closeCart">
                <img :src="item.img.split(',')[0]" :alt="item.name" class="item-image">
              </NuxtLink>
              <div class="item-details">
                <div class="font-semibold">
                  {{ item.name }}
                </div>
                <div class="text-sm text-gray-500">
                  SKU: {{ getCartItemDetails(item)?.sku }}
                </div>
                <div class="quantity-selector">
                  <button @click="handleQuantityUpdate(item.id, item.quantity - 1)">
                    -
                  </button>
                  <input
                    type="number"
                    class="quantity-input"
                    :value="item.quantity"
                    min="0"
                    @change="handleQuantityUpdate(item.id, ($event.target as HTMLInputElement).value)"
                  >
                  <button @click="cartStore.incrementQuantity(item.id)">
                    +
                  </button>
                </div>
              </div>
              <div class="item-actions">
                <el-button type="danger" plain @click="cartStore.removeItem(item.id)">
                  <Icon name="carbon:trash-can" />
                </el-button>
                <div class="font-semibold mt-auto">
                  {{ currencyStore.currencySymbol }}{{ (Number(getCartItemDetails(item)?.price) * item.quantity).toFixed(2) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 border-t">
          <div class="flex justify-between items-center mb-2">
            <span class="font-semibold">{{ $t('cart.subtotal') }}</span>
            <span class="font-bold text-xl">{{ currencyStore.currencySymbol }}{{ cartStore.subtotal.toFixed(2) }}</span>
          </div>
          <p class="text-sm text-gray-500 mb-4">
            {{ $t('cart.shipping_note') }}
          </p>
          <button
            class="w-full py-3 rounded-md font-semibold transition-colors outline-none border-none"
            :disabled="cartStore.cartCount === 0 || isCheckingStock"
            :class="[
              cartStore.cartCount > 0 && !isCheckingStock
                ? 'bg-sky-500 text-white hover:bg-sky-600 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed',
            ]"
            @click="handleCheckout"
          >
            {{ $t('cart.checkout') }}
          </button>
        </div>
      </div>
    </div>
  </el-drawer>

  <!-- Out of Stock Dialog -->
  <el-dialog v-model="showOutOfStockDialog" title="Out of stock" width="500px" center>
    <p class="text-center text-gray-600 mb-6">
      Some items are no longer available and have been removed from your cart.
    </p>
    <div class="space-y-4 max-h-60 overflow-y-auto">
      <div v-for="item in outOfStockDialogItems" :key="item.id" class="flex items-center justify-between p-2 border rounded-md">
        <div class="flex items-center gap-4">
          <img :src="item.img.split(',')[0]" :alt="item.name" class="w-16 h-16 object-cover rounded">
          <span>{{ item.name }}</span>
        </div>
        <span class="text-red-500 font-semibold">SOLD OUT</span>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end items-center gap-4">
        <el-button link @click="showOutOfStockDialog = false">
          Return to cart
        </el-button>
        <el-button type="primary" @click="confirmContinueCheckout">
          Continue checkout
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.cart-item {
  display: flex;
  gap: 1rem;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}
.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  flex-shrink: 0;
}
.item-details {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  width: fit-content;
  margin-top: 0.5rem;
}
.quantity-selector button {
  width: 28px;
  height: 28px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #6b7280;
}
.quantity-input {
  width: 50px;
  text-align: center;
  border: none;
  background-color: transparent;
  color: #374151;
  font-size: 0.875rem;
  -moz-appearance: textfield;
}
.quantity-input::-webkit-outer-spin-button,
.quantity-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
}
</style>
