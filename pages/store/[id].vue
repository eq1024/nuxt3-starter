<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '~/store/cart'
import { useCurrencyStore } from '~/store/currency'

// --- Mock Data Store ---
const allProducts = ref<any[]>([
  {
    id: 1,
    name: 'Premium Replacement Screen for Model X',
    description: 'High-quality, pixel-perfect replacement screen. Includes all necessary tools for a DIY repair. This detailed description covers aspects like screen resolution, color accuracy, and included components. It is designed to be informative and build customer confidence.',
    img: 'https://dummyimage.com/800x600/cccccc/ffffff.png&text=Product+Image+1,https://dummyimage.com/800x600/cccccc/ffffff.png&text=Product+Image+2',
    compatibility: 'Model X, Model X Pro',
    shop_part_details_list: [
      { id: 1, part_id: 1, sales_area: 1, price: '69.99', sku: 'SKU-MX-SCR-US', status: 1 },
      { id: 2, part_id: 1, sales_area: 2, price: '79.99', sku: 'SKU-MX-SCR-EU', status: 1 },
    ],
    tag_id: 101,
    brand_id: 201,
  },
  {
    id: 2,
    name: 'Long-Life Battery for Model Y',
    description: 'Boost your device\'s life with our extended-capacity battery. Lasts 30% longer than the original.',
    img: 'https://dummyimage.com/800x600/cccccc/ffffff.png&text=Product+Image',
    compatibility: 'Model Y (All versions)',
    shop_part_details_list: [
      { id: 3, part_id: 2, sales_area: 1, price: '49.99', sku: 'SKU-MY-BAT-US', status: 1 },
      { id: 4, part_id: 2, sales_area: 2, price: '54.99', sku: 'SKU-MY-BAT-EU', status: 0 },
    ],
    tag_id: 101,
    brand_id: 202,
  },
  {
    id: 3,
    name: 'Camera Module for Model Z',
    description: 'Capture stunning photos again with this OEM-grade replacement camera module.',
    img: 'https://dummyimage.com/800x600/cccccc/ffffff.png&text=Product+Image',
    compatibility: 'Model Z, Model Z Plus',
    shop_part_details_list: [
      { id: 5, part_id: 3, sales_area: 1, price: '89.99', sku: 'SKU-MZ-CAM-US', status: 1 },
      { id: 6, part_id: 3, sales_area: 2, price: '99.99', sku: 'SKU-MZ-CAM-EU', status: 1 },
    ],
    tag_id: 102,
    brand_id: 201,
  },
  ...Array.from({ length: 12 }, (_, i) => {
    const partId = i + 4
    return {
      id: partId,
      name: `Generic Part ${i + 1}`,
      description: `This is a description for generic part ${i + 1}.`,
      img: `https://dummyimage.com/800x600/cccccc/ffffff.png&text=Part+${i + 1}`,
      compatibility: 'Universal',
      shop_part_details_list: [
        { id: i * 2 + 7, part_id: partId, sales_area: 1, price: (10 + i * 2).toFixed(2), sku: `SKU-GEN-${i}-US`, status: 1 },
        { id: i * 2 + 8, part_id: partId, sales_area: 2, price: (12 + i * 2).toFixed(2), sku: `SKU-GEN-${i}-EU`, status: 1 },
      ],
      tag_id: 102 + (i % 2),
      brand_id: 201 + (i % 3),
    }
  }),
])
// --- End Mock Data ---

const route = useRoute()
const cartStore = useCartStore()
const currencyStore = useCurrencyStore()
const isAddingMain = ref(false)
const isAddingBottom = ref(false)
const loadingProduct = ref(true)

const partId = Number(route.params.id)
const product = ref<any>(null)

onMounted(() => {
  const foundProduct = allProducts.value.find(p => p.id === partId)
  setTimeout(() => { // Simulate loading
    product.value = foundProduct || null
    loadingProduct.value = false
  }, 300)
})

const guidesList = computed(() => {
  // Mock related guides
  if (product.value) {
    return [
      { id: 1001, title: `How to Replace the ${product.value.name}`, img: 'https://dummyimage.com/800x600/cccccc/ffffff.png&text=Guide+1', time_min: 15, time_max: 30, level: 1 },
      { id: 1002, title: `Troubleshooting Your New ${product.value.name}`, img: 'https://dummyimage.com/800x600/cccccc/ffffff.png&text=Guide+2', time_min: 10, time_max: 20, level: 0 },
    ]
  }
  return []
})

const selectedVariant = computed(() => {
  if (!product.value || !product.value.shop_part_details_list || product.value.shop_part_details_list.length === 0)
    return null
  return product.value.shop_part_details_list.find((d: any) => d.sales_area === currencyStore.sales_area) || product.value.shop_part_details_list[0]
})

const productImages = computed(() => product.value?.img ? product.value.img.split(',') : [])
const productCompatibility = computed(() => product.value?.compatibility ? product.value.compatibility.split(',') : [])

const isAreaMismatch = computed(() => {
  if (!product.value || !selectedVariant.value)
    return false
  return selectedVariant.value.sales_area !== currencyStore.sales_area
})

const inStock = computed(() => selectedVariant.value?.status === 1 && !isAreaMismatch.value)
const currentImageIndex = ref(0)

function changeImage(index: number) {
  currentImageIndex.value = index
}

const mainButtonClass = computed(() => {
  if (isAddingMain.value)
    return 'bg-green-500 text-white'
  return inStock.value ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
})

const bottomButtonClass = computed(() => {
  if (isAddingBottom.value)
    return 'bg-green-500 text-white'
  return inStock.value ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
})

const actionButtonText = computed(() => {
  return inStock.value ? 'Add to cart' : 'Out of stock'
})

function handleAddToCart(buttonType: 'main' | 'bottom') {
  if (!inStock.value)
    return
  const isAddingRef = buttonType === 'main' ? isAddingMain : isAddingBottom
  if (isAddingRef.value)
    return
  isAddingRef.value = true
  if (product.value) {
    const itemToAdd = {
      ...product.value,
      shop_part_details_list: [selectedVariant.value],
    }
    cartStore.addItem(itemToAdd as App.Part['parts_info'])
  }
  setTimeout(() => {
    isAddingRef.value = false
  }, 600)
}

function getDifficultyText(level: number) {
  switch (level) {
    case 0: return 'Moderate'
    case 1: return 'Very Easy'
    case 2: return 'Difficult'
    case 3: return 'Very Difficult'
    default: return 'Unknown'
  }
}
</script>

<template>
  <div class="pb-24 mb--60px" :class="{ 'bg-gray-50': !loadingProduct }">
    <div v-if="loadingProduct" class="w-full min-h-400px flex justify-center items-center">
      <LoadingCom />
    </div>
    <template v-else>
      <div v-if="product" class="max-w-6xl mx-auto p-4 md:p-8">
        <div v-if="isAreaMismatch" class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
          <p class="font-bold">
            Item not available in your region
          </p>
          <p>This product is not available for sale in your selected region. You can view the product, but you cannot purchase it.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div class="flex flex-col gap-4">
            <div class="aspect-square bg-white rounded-lg flex items-center justify-center p-4 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
              <img :key="currentImageIndex" :src="productImages[currentImageIndex]" alt="Product Image" class="max-w-full max-h-full object-contain transition-all duration-500">
            </div>
            <div class="flex gap-3 justify-center">
              <div v-for="(image, index) in productImages" :key="index" class="w-1/3 aspect-[4/3] bg-white rounded-lg p-2 cursor-pointer overflow-hidden transition-all duration-200 shadow-sm" :class="currentImageIndex === index ? 'ring-2 ring-blue-500 shadow-md' : 'hover:shadow-md hover:scale-105'" @mouseover="changeImage(index)">
                <img :src="image" alt="Thumbnail" class="w-full h-full object-contain transition-transform duration-300 hover:scale-110">
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-4">
            <h1 class="text-3xl font-bold my-0 mb--4px">
              {{ product.name }}
            </h1>
            <p class="text-gray-500 my-0 mb--4px">
              SKU: {{ selectedVariant?.sku }}
            </p>
            <p v-if="!isAreaMismatch" class="text-xl font-semibold my-0 mb--4px">
              {{ currencyStore.sales_area === 1 ? '$' : '€' }} {{ selectedVariant?.price }}
            </p>
            <button :class="mainButtonClass" class="w-full py-3 rounded-md text-lg font-semibold transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer border-none" :disabled="!inStock || isAddingMain" @click="handleAddToCart('main')">
              <Transition name="fade" mode="out-in">
                <span v-if="isAddingMain" key="icon" class="flex items-center justify-center"><i class="i-carbon-checkmark text-2xl" /></span>
                <span v-else key="text">{{ actionButtonText }}</span>
              </Transition>
            </button>
            <div>
              <h2 class="text-xl font-semibold mb-2">
                Compatibility
              </h2>
              <div class="border border-gray-200 rounded-md p-4 text-gray-600 bg-white shadow-sm">
                {{ productCompatibility.join(', ') }}
              </div>
            </div>
            <div>
              <h2 class="text-xl font-semibold mb-2">
                Description
              </h2>
              <div class="prose max-w-none break-words" v-html="product.description" />
            </div>
          </div>
        </div>
        <div class="mt-16">
          <h2 class="text-2xl md:text-3xl font-bold text-center mb-8">
            Replacement Guides
          </h2>
          <div v-if="guidesList.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <NuxtLink v-for="(guide, index) in guidesList" :key="index" to="/" class="block bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 no-underline text-current">
              <img :src="guide.img?.split(',')[0]" :alt="guide.title" class="w-full h-48 object-cover">
              <div class="p-4">
                <h3 class="font-semibold mb-4 h-12">
                  {{ guide.title }}
                </h3>
                <div class="flex justify-between text-sm text-gray-500">
                  <span><i class="i-carbon-time mr-1" /> <span v-if="Number(guide.time_min) !== 0">{{ guide.time_min }} -</span>{{ guide.time_max }} min</span>
                  <span class="tag difficulty"><icon name="carbon:service-levels" class="text-30px" /> {{ getDifficultyText(guide.level) }}</span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
      <div v-else class="text-center p-10">
        <p>Product not found.</p>
      </div>
      <div v-if="product" class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-5px_15px_rgba(0,0,0,0.07)] z-50">
        <div class="max-w-6xl mx-auto p-3 flex justify-between items-center">
          <div class="flex-1 min-w-0 mr-4">
            <p class="font-bold text-sm md:text-base truncate">
              {{ product.name }}
            </p>
            <p v-if="!isAreaMismatch" class=" text-sm my-0 mt--4px truncate">
              {{ currencyStore.sales_area === 1 ? '$' : '€' }} {{ selectedVariant?.price }}
            </p>
          </div>
          <button :class="bottomButtonClass" class="px-6 py-2.5 rounded-md font-semibold transition-all duration-300 shadow-sm hover:shadow-md flex-shrink-0 cursor-pointer border-none" :disabled="!inStock || isAddingBottom" @click="handleAddToCart('bottom')">
            <Transition name="fade" mode="out-in">
              <span v-if="isAddingBottom" key="icon-bottom" class="flex items-center justify-center"><i class="i-carbon-checkmark text-xl" /></span>
              <span v-else key="text-bottom">{{ actionButtonText }}</span>
            </Transition>
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.prose p { margin-bottom: 1em; }
.prose ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1em; }
.prose li { margin-bottom: 0.5em; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.tag { display: flex; align-items: center; gap: 0.5rem; background-color: #f3f4f6; color: #7c7c7c; border-radius: 4px; padding: 3px 8px; font-size: 0.875rem; }
.tag.difficulty { background-color: #fef3c7; color: #92400e; }
</style>
