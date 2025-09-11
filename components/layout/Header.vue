<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { ElMessageBox } from 'element-plus'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartDrawer } from '~/composables/useCartDrawer'
import { useUserStore } from '~/store/user'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const { openCart } = useCartDrawer()

const keyword = ref('')
const isDropdownVisible = ref(false) // Keep this for potential future use with search dropdown

const debouncedSearch = useDebounceFn(async () => {
  if (keyword.value.trim()) {
    router.push({ path: '/store', query: { keyword: keyword.value } })
    isDropdownVisible.value = false // Close dropdown on search
  }
}, 350)
watch(keyword, debouncedSearch)

function handleCommand(command: string) {
  if (command === 'logout') {
    ElMessageBox.confirm(
      t('header.logoutConfirmText'),
      t('header.logoutConfirmTitle'),
      {
        confirmButtonText: t('header.confirmButtonText'),
        cancelButtonText: t('header.cancelButtonText'),
        type: 'warning',
      },
    )
      .then(() => {
        userStore.logout()
      })
      .catch(() => {
        // User cancelled the action
      })
  }
}
</script>

<template>
  <div>
    <header class="fixed top-0 left-0 w-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg z-50 border-b border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300">
      <div class="container mx-auto h-20 flex items-center justify-between px-6">
        <!-- Left Section: Logo and Nav -->
        <div class="flex items-center gap-10">
          <NuxtLink to="/" class="flex items-center gap-3 text-gray-800 dark:text-white">
            <img src="/logo/Silvervale.png" alt="Logo" class="h-12 rounded-md">
            <span class="font-semibold text-2xl tracking-wider" />
          </NuxtLink>
          <nav class="hidden md:flex items-center gap-8 text-base font-medium text-gray-500 dark:text-gray-400">
            <NuxtLink to="/store" class="clear-link relative py-2 transition-colors duration-300 hover:text-gray-900 dark:hover:text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-sky-500 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100">
              {{ t('header.partsStore') }}
            </NuxtLink>
          </nav>
        </div>

        <!-- Right Section: Actions -->
        <div class="flex items-center gap-5">
          <button class="h-11 w-11 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-colors" @click="openCart">
            <Icon name="carbon:shopping-cart" class="text-2xl" />
          </button>

          <el-dropdown v-if="userStore.userInfo && useCookie('factoryToken').value" trigger="click" @command="handleCommand">
            <button class="h-11 w-11 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 hover:opacity-90 transition-opacity">
              <Icon name="carbon:user-avatar" class="text-2xl text-gray-700 dark:text-gray-200" />
            </button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <div class="font-semibold">
                    {{ userStore.userName }}
                  </div>
                </el-dropdown-item>
                <a href="/cfAdmin/" target="_blank" class="no-underline text-inherit">
                  <el-dropdown-item>
                    {{ t('header.admin') }}
                  </el-dropdown-item>
                </a>
                <el-dropdown-item command="logout" divided>
                  {{ t('header.logout') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <NuxtLink v-else to="/login" class="px-6 py-2.5 rounded-full text-base font-semibold bg-gray-800 text-white hover:bg-gray-950 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 transition-colors duration-300">
            {{ t('header.signIn') }}
          </NuxtLink>
        </div>
      </div>
    </header>
  </div>
</template>

<style scoped>
/* Styles for cart items have been moved to layouts/default.vue */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
