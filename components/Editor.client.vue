<script setup lang="ts">
import { ref } from 'vue'
import FormattedText from './FormattedText.vue'

const rawContent = ref('')
const linkDialogVisible = ref(false)
const linkForm = ref({
  text: '',
  url: '',
  newWindow: false,
})

function insertFormatting(format: string) {
  const textarea = document.querySelector('.input-area') as HTMLTextAreaElement
  if (!textarea)
    return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = rawContent.value.substring(start, end)

  let formattedText = format

  if (format === 'bold') {
    formattedText = `***${selectedText}***`
  }
  else if (format === 'italic') {
    formattedText = `~~${selectedText}~~`
  }
  else if (format === 'underline') {
    formattedText = `++${selectedText}++`
  }

  rawContent.value = rawContent.value.substring(0, start) + formattedText + rawContent.value.substring(end)

  // Move cursor to after the inserted text
  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(start + formattedText.length, start + formattedText.length)
  }, 0)
}

function openLinkDialog() {
  const textarea = document.querySelector('.input-area') as HTMLTextAreaElement
  if (!textarea)
    return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = rawContent.value.substring(start, end)

  linkForm.value = {
    text: selectedText,
    url: '',
    newWindow: false,
  }

  linkDialogVisible.value = true
}

function insertLink() {
  const textarea = document.querySelector('.input-area') as HTMLTextAreaElement
  if (!textarea || !linkForm.value.url)
    return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd

  const linkText = linkForm.value.text || linkForm.value.url
  const newWindowParam = linkForm.value.newWindow ? '|new_window=true' : ''
  const linkString = `[${linkText}|${linkForm.value.url}${newWindowParam}|]`

  rawContent.value = rawContent.value.substring(0, start) + linkString + rawContent.value.substring(end)

  // Move cursor to after the inserted link
  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(start + linkString.length, start + linkString.length)
  }, 0)

  linkDialogVisible.value = false
}
</script>

<template>
  <div class="editor-container">
    <div class="formatted-text-editor">
      <div class="toolbar">
        <ElButton icon="document" @click="insertFormatting('bold')">
          加粗
        </ElButton>
        <ElButton icon="edit" @click="insertFormatting('italic')">
          斜体
        </ElButton>
        <ElButton icon="underline" @click="insertFormatting('underline')">
          下划线
        </ElButton>
        <ElButton icon="link" @click="openLinkDialog">
          链接
        </ElButton>
      </div>

      <textarea
        v-model="rawContent"
        class="input-area"
        placeholder="输入格式化文本，例如：***加粗*** ~~斜体~~ ++下划线++ [link|https://example.com|new_window=true|链接]"
      />

      <div class="preview-label">
        预览：
      </div>
      <FormattedText :content="rawContent" />
    </div>
  </div>
</template>

<style scoped>
.toolbar {
  margin-bottom: 1rem;
}
.formatted-text-editor {
  margin-top: 1rem;
  padding: 1rem;
  border-top: 1px solid #e4e4e4;
}
.input-area {
  width: 100%;
  height: 150px;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
}
.preview-label {
  margin-top: 1rem;
  font-weight: bold;
}
.link-form .form-group {
  margin-bottom: 1.5rem;
}
.link-form label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
</style>

<style scoped>
.toolbar {
  margin-bottom: 1rem;
}
.input-area {
  width: 100%;
  height: 150px;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
}
/* Additional style to enhance UX */
.el-button--mini,
.el-button--small {
  font-size: 0.8rem;
}
.formatted-text-editor {
  margin-top: 1rem;
  padding: 1rem;
  border-top: 1px solid #e4e4e4;
}
.preview-label {
  margin-top: 1rem;
  font-weight: bold;
}
.link-form .form-group {
  margin-bottom: 1.5rem;
}
.link-form label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
</style>

<style scoped>
.toolbar {
  margin-bottom: 1rem;
}
.formatted-text-editor {
  margin-top: 1rem;
  padding: 1rem;
  border-top: 1px solid #e4e4e4;
}
.input-area {
  width: 100%;
  height: 150px;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
}
.preview-label {
  margin-top: 1rem;
  font-weight: bold;
}
.link-form .form-group {
  margin-bottom: 1.5rem;
}
.link-form label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
</style>
