<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCurrencyStore } from '~/store/currency'

const route = useRoute()
const currencyStore = useCurrencyStore()
const currentPage = ref(1)
const pageSize = 9

// --- Mock Data ---
const allProducts = ref<any[]>([
  {
    id: 1,
    name: 'Premium Replacement Screen for Model X',
    description: 'High-quality, pixel-perfect replacement screen. Includes all necessary tools for a DIY repair.',
    img: 'https://dummyimage.com/800x600/cccccc/ffffff.png&text=Product+Image',
    compatibility: 'Model X, Model X Pro',
    shop_part_details_list: [
      { id: 1, part_id: 1, sales_area: 1, price: '69.99', sku: 'SKU-MX-SCR-US', status: 1 },
      { id: 2, part_id: 1, sales_area: 2, price: '79.99', sku: 'SKU-MX-SCR-EU', status: 1 },
    ],
    tag_id: 101, // Device Type ID
    brand_id: 201, // Brand ID
  },
  {
    id: 2,
    name: 'Long-Life Battery for Model Y',
    description: 'Boost your device\'s life with our extended-capacity battery. Lasts 30% longer than the original.',
    img: 'https://dummyimage.com/800x600/cccccc/ffffff.png&text=Product+Image',
    compatibility: 'Model Y (All versions)',
    shop_part_details_list: [
      { id: 3, part_id: 2, sales_area: 1, price: '49.99', sku: 'SKU-MY-BAT-US', status: 1 },
      { id: 4, part_id: 2, sales_area: 2, price: '54.99', sku: 'SKU-MY-BAT-EU', status: 0 }, // Out of stock in EU
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
  // Add 12 more products to make a total of 15 for pagination demo
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

const deviceTypes = ref([
  { id: 101, name: 'Phone' },
  { id: 102, name: 'Tablet' },
  { id: 103, name: 'Laptop' },
])

const brands = ref([
  { id: 201, name: 'BrandA' },
  { id: 202, name: 'BrandB' },
  { id: 203, name: 'BrandC' },
])
// --- End Mock Data ---

const selectedDeviceType = ref<number | undefined>(route.query.tag_id ? Number(route.query.tag_id) : undefined)
const selectedBrand = ref<number | undefined>(route.query.brand_id ? Number(route.query.brand_id) : undefined)
const searchKeyword = ref(route.query.keyword ? String(route.query.keyword) : '')

const filteredProducts = computed(() => {
  let products = allProducts.value
  if (selectedDeviceType.value)
    products = products.filter(p => p.tag_id === selectedDeviceType.value)

  if (selectedBrand.value)
    products = products.filter(p => p.brand_id === selectedBrand.value)

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    products = products.filter(p => p.name.toLowerCase().includes(keyword) || p.description.toLowerCase().includes(keyword))
  }
  return products
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredProducts.value.slice(start, end)
})

const totalProducts = computed(() => filteredProducts.value.length)

watch([selectedDeviceType, selectedBrand, searchKeyword], () => {
  currentPage.value = 1
})

function handlePageChange(page: number) {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function getProductDetails(product: App.Part['parts_info']) {
  if (!product.shop_part_details_list || product.shop_part_details_list.length === 0)
    return null
  return product.shop_part_details_list.find(d => d.sales_area === currencyStore.sales_area) || product.shop_part_details_list[0]
}
</script>

<template>
  <div class="store-page">
    <section class="hero">
      <h1>Parts Store</h1>
    </section>
    <section class="filters-section">
      <div class="container">
        <div class="filter">
          <label for="device-type">Device Type:</label>
          <el-select id="device-type" v-model="selectedDeviceType" filterable placeholder="All Devices" clearable>
            <el-option v-for="item in deviceTypes" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </div>
        <div class="filter">
          <label for="brand">Brand:</label>
          <el-select id="brand" v-model="selectedBrand" filterable placeholder="All Brands" clearable>
            <el-option v-for="item in brands" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </div>
        <div class="filter">
          <label for="parts-name">Parts name:</label>
          <el-input id="parts-name" v-model="searchKeyword" placeholder="Search Parts..." />
        </div>
      </div>
    </section>

    <section class="products-section">
      <div class="container">
        <div v-if="paginatedProducts.length > 0" class="products-grid">
          <div v-for="product in paginatedProducts" :key="product.id" class="product-card">
            <div class="image-container">
              <img v-if="product.img" :src="product.img.split(',')[0]" :alt="product.name" class="product-image">
              <div v-else class="image-placeholder">
                <icon name="carbon:image-search" class="text-4xl text-gray-400" />
              </div>
            </div>
            <div class="card-content">
              <h3 class="product-name">
                {{ product.name }}
              </h3>
              <p class="product-description" :title="product.description">
                {{ product.description }}
              </p>
              <div class="card-footer">
                <span class="price"> {{ currencyStore.sales_area === 1 ? '$' : '€' }} {{ getProductDetails(product)?.price }}</span>
                <NuxtLink :to="`/store/${product.id}`">
                  <el-button v-if="getProductDetails(product)?.status" type="primary">
                    View
                  </el-button>
                  <el-button v-else class="bg-gray-200 text-gray-500 cursor-pointer">
                    Out of stock
                  </el-button>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <el-empty description="No parts found. Try adjusting your filters." />
        </div>
        <div class="pagination-container">
          <el-pagination
            v-if="totalProducts > pageSize"
            background
            layout="prev, pager, next"
            :total="totalProducts"
            :current-page="currentPage"
            :page-size="pageSize"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.store-page { font-family: "Roboto", sans-serif; }
.hero {
  padding: 4rem 2rem;
  text-align: center;
  color: white;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
  position: relative;
  overflow: hidden;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
.hero h1 { font-size: 3rem; font-weight: bold; }
.filters-section {
  padding: 2rem;
  background-color: #fff;
  border-bottom: 1px solid #e5e7eb;
}
.filters-section .container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 2rem;
  align-items: center;
  flex-wrap: wrap;
}
.filter { display: flex; align-items: center; gap: 0.5rem;min-width: 280px; }
.filter label { font-weight: 500;width: auto;flex-shrink: 0; }
.products-section { padding: 3rem 2rem; background-color: #f9fafb; }
.products-section .container { max-width: 1200px; margin: 0 auto; }
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}
.product-card {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
.image-container {
  height: 220px;
  background-color: #f3f4f6;
  display: flex;
  justify-content: center;
  align-items: center;
}
.product-image { width: 100%; height: 100%; object-fit: cover; }
.image-placeholder { width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; }
.card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.product-name {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  height: 3.375rem; /* 1.125rem * 1.5 line-height * 2 lines */
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.product-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1rem;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.price { font-size: 1.25rem; font-weight: bold; }
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}
.empty-state {
  padding: 4rem 0;
}
</style>
