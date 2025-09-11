<script setup lang="ts">
import { useGlobalLoading } from '~/composables/useGlobalLoading'

const { globalLoading } = useGlobalLoading()
</script>

<template>
  <main class="flex flex-col min-h-screen bg-#525F7F">
    <LayoutHeader />
    <div v-loading="globalLoading" class="flex-grow-1">
      <slot>
        loading
      </slot>
    </div>
    <LayoutFooter />
    <CartDrawer />
  </main>
</template>

<style scoped></style>
