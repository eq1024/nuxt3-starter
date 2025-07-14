<script setup lang="ts">
import { onMounted, ref } from 'vue'

import('vditor/dist/index.css')

const vditor = ref<any>(null)
defineExpose({
  getValue,
  clear,
})

onMounted(async () => {
  const Vditor = (await import('vditor')).default
  vditor.value = new Vditor('vditor', {
    after: () => {
      vditor.value.setValue('')
    },
    toolbar: ['bold', 'italic', 'list', 'ordered-list', 'link'],
    lang: 'en_US',
    icon: 'material',
  })
})

function getValue() {
  console.log(vditor.value.getValue())
}
function clear() {
  vditor.value.setValue('')
}
</script>

<template>
  <div id="vditor" />
  <el-button @click="getValue">
    获取
  </el-button>
</template>
