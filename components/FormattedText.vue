<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  content: string
}>()

const processedContent = computed(() => {
  if (!props.content)
    return ''

  // Process links first to handle nested formatting inside links
  let result = props.content.replace(/\[([^|$]+)\|([^|$]+)(?:\|([^|$]*))?\|?([^$]*)\]/g, (match, p1, p2, p3, p4) => {
    // p1: link text, p2: url, p3: additional params, p4: alternative representation
    const target = p3?.includes('new_window=true') ? '_blank' : ''
    const rel = target === '_blank' ? 'noopener noreferrer' : ''
    return `<a href="${p2}" target="${target}" rel="${rel}">${p1}</a>`
  })

  // Process bold
  result = result.replace(/\*\*\*(.*?)\*\*\*/g, '<strong>$1</strong>')

  // Process italic: changed from ''...'' to ~~...~~
  result = result.replace(/~~(.*?)~~/g, '<em>$1</em>')

  // Process underline
  result = result.replace(/\+\+(.*?)\+\+/g, '<u>$1</u>')

  return result
})
</script>

<template>
  <div class="formatted-text">
    <div v-html="processedContent" />
  </div>
</template>

<style scoped>
.formatted-text {
  line-height: 1.6;
  font-size: 1rem;
  color: #333;
}
</style>
