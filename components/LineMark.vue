<script setup lang="ts">
import { ref } from 'vue'
import types from '~/constants/line'

const { disabled = false } = defineProps<{
  disabled?: boolean
}>()
const type = defineModel<number>('type')
const specialTypes = types.slice(8)
const showPopover = ref(false)

function toggleType(newType: number) {
  if (disabled) {
    return
  }
  type.value = newType
  showPopover.value = false // Close the popover after selecting a type
}
</script>

<template>
  <div>
    <ElPopover
      placement="left"
      width="200"
      trigger="click"
      :disabled="disabled"
    >
      <ClientOnly>
        <div class="flex flex-row">
          <div v-for="(item, index) in types" :key="index" class="flex items-center mb-2" :class="{ 'cursor-pointer': !disabled }" @click="toggleType(index)">
            <div v-if=" Number(index) < 8" class="flex flex-wrap">
              <Icon :name="item.icon" :style="{ 'color': item.color, 'font-size': '22px' }" />
            </div>
          </div>
        </div>
        <div v-for="(item, index) in specialTypes" :key="index" class="flex items-center mb-2 mt-6px" :class="{ 'cursor-pointer': !disabled }" @click="toggleType(Number(index) + 8)">
          <Icon :name="item.icon" :style="{ 'color': item.color, 'font-size': '18px' }" />
          <span class="ml-2">{{ item.name }}</span>
        </div>
      </ClientOnly>
      <template #reference>
        <div v-if="type !== undefined">
          <div v-if="type < 8" class="mt-2px flex items-center mr--4px" :class="{ 'cursor-pointer': !disabled }" @click="showPopover = !showPopover">
            <Icon :name="types[type].icon" :style="{ 'color': types[type].color, 'font-size': '22px' }" />
            <span class="ml-2">{{ types[type].name }}</span>
          </div>
          <div v-else class="flex items-center mr-6px" :class="{ 'cursor-pointer': !disabled }" @click="showPopover = !showPopover">
            <Icon :name="types[type].icon" :style="{ 'color': types[type].color, 'font-size': '18px' }" />
          </div>
        </div>
      </template>
    </ElPopover>
  </div>
</template>

<style scoped>
/* Add any necessary styles here */
</style>
