<script setup lang="ts">
</script>

<template>
  <div class="tutorial-container">
    <h1 class="tutorial-title">
      格式化文本编辑器示例
    </h1>

    <div class="demo-section">
      <h2 class="section-title">
        编辑区域
      </h2>
      <p class="description">
        在下面的文本框中输入格式化文本，例如：***加粗*** ''斜体'' ++下划线++ [link|https://example.com|new_window=true|链接]
      </p>
      <Editor />
    </div>

    <div class="instructions">
      <h2 class="section-title">
        支持的格式说明
      </h2>
      <ul class="format-list">
        <li><strong>加粗：</strong> 使用 ***文本***</li>
        <li><em>斜体：</em> 使用 ''文本''</li>
        <li><u>下划线：</u> 使用 ++文本++</li>
        <li><a href="https://github.com/subframe7536/maple-font/releases/download/v7.0-beta32/MapleMono-NF-CN-unhinted.zip" target="_blank" rel="noopener noreferrer">链接：</a> 使用 [显示文本|URL|new_window=true|可选参数]</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.tutorial-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}
.tutorial-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}
.demo-section {
  margin-bottom: 2rem;
}
.section-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
.description {
  margin-bottom: 1rem;
  line-height: 1.6;
}
.instructions {
  background-color: #f8f8f8;
  padding: 1rem;
  border-radius: 8px;
}
.format-list {
  list-style-type: none;
  padding-left: 0;
}
.format-list li {
  margin-bottom: 0.5rem;
}
</style>
