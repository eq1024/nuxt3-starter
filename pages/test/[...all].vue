<script setup>
const time = ref(0)
time.value = String(new Date())
</script>

<template>
  <div style="font-size: 1rem;">
    test {{ time }}
    <el-button>测试按钮</el-button>
  </div>
</template>

<style lang="scss" scoped>

</style>
