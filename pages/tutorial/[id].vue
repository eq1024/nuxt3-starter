<script setup lang="ts">
import('vditor/dist/index.css')

const vditor = ref<any>(null)
const show = ref(false)
const html = ref('')

onMounted(async () => {
  const Vditor = (await import('vditor')).default
  vditor.value = new Vditor('invisible', {
    after: () => {
      vditor.value.setValue('')
    },
  })
})

function getHTML() {
  vditor.value.setValue(`**这是粗体**

[这是链接](https://baidu.com)

* 1
* 2
  * 3`)

  nextTick(() => {
    html.value = vditor.value.getHTML()
    console.log('getHTML ->', vditor.value.getHTML())
  })
}
</script>

<template>
  <!-- <div id="vditor" /> -->
  <el-button @click="show = !show">
    ddd
  </el-button>
  <el-button v-show="show" @click="getHTML">
    获取
  </el-button>
  <div v-html="html" />
  <div id="invisible" class="w-0 h-0 invisible" />
</template>
