<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCurrencyStore } from '~/store/currency'

const quickLinks = ref([
  { name: 'Store', path: '/store' },
  { name: 'Login', path: '/login' },
])
</script>

<template>
  <footer class="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
    <div class="container mx-auto px-6 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Column 1: Logo and Slogan -->
        <div class="flex flex-col items-start">
          <div class="flex items-center gap-3 mb-4">
            <img src="/logo/Silvervale.png" alt="Logo" class="h-10 rounded-md">
            <span class="font-semibold text-xl text-gray-800 dark:text-white">Nuxt3-Starter</span>
          </div>
          <p class="text-gray-500 dark:text-gray-400 max-w-xs">
            A clean and modern starter kit to kickstart your next big idea.
          </p>
        </div>

        <!-- Column 2: Quick Links -->
        <div>
          <h3 class="font-semibold text-gray-800 dark:text-white mb-4">
            Quick Links
          </h3>
          <nav class="flex flex-col gap-3">
            <NuxtLink v-for="link in quickLinks" :key="link.name" :to="link.path" class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              {{ link.name }}
            </NuxtLink>
          </nav>
        </div>

        <!-- Column 3: Social Media -->
        <div>
          <h3 class="font-semibold text-gray-800 dark:text-white mb-4">
            Follow Us
          </h3>
          <div class="flex items-center gap-4">
            <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <Icon name="carbon:logo-github" class="text-2xl" />
            </a>
            <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <Icon name="carbon:logo-twitter" class="text-2xl" />
            </a>
            <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <Icon name="carbon:logo-linkedin" class="text-2xl" />
            </a>
          </div>
        </div>
      </div>
      <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-400 dark:text-gray-500">
        &copy; 2025 Starter Kit. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* All styles are handled by UnoCSS/Tailwind utility classes. */
</style>
