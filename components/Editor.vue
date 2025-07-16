<script setup lang="ts">
import { ref } from 'vue'
import FormattedText from './FormattedText.vue'

const rawContent = ref('')
const linkDialogVisible = ref(false)
const linkForm = ref({
  text: '',
  url: '',
  newWindow: true,
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

  // Move cursor to after the inserted text or in the middle of selected text
  setTimeout(() => {
    textarea.focus()
    if (selectedText) {
      // If text was selected, put cursor at the end of the selection
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length)
    }
    else {
      // If no text was selected, put cursor in the middle of the inserted format
      let cursorPosition = start
      if (format === 'bold') {
        cursorPosition = start + 3 // After ***|
      }
      else if (format === 'italic') {
        cursorPosition = start + 2 // After ~~|
      }
      else if (format === 'underline') {
        cursorPosition = start + 2 // After ++|
      }
      textarea.setSelectionRange(cursorPosition, cursorPosition)
    }
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
    newWindow: true,
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
        <ElButton @click="insertFormatting('bold')">
          <Icon name="carbon:text-bold" /> 加粗
        </ElButton>
        <ElButton @click="insertFormatting('italic')">
          <Icon name="carbon:text-italic" /> 斜体
        </ElButton>
        <ElButton @click="insertFormatting('underline')">
          <Icon name="carbon:text-underline" /> 下划线
        </ElButton>
        <ElButton @click="openLinkDialog">
          <Icon name="carbon:link" /> 链接
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

    <ElDialog
      v-model="linkDialogVisible"
      title="插入链接"
      :close-on-click-modal="false"
      width="400px"
    >
      <ElForm class="link-form" label-position="top">
        <ElFormItem label="链接文本">
          <ElInput v-model="linkForm.text" placeholder="请输入链接文本" />
        </ElFormItem>
        <ElFormItem label="链接地址">
          <ElInput v-model="linkForm.url" placeholder="https://example.com" />
        </ElFormItem>
        <ElFormItem>
          <ElCheckbox v-model="linkForm.newWindow">
            在新窗口打开
          </ElCheckbox>
        </ElFormItem>
      </ElForm>
      <template #footer>
        <div class="dialog-footer">
          <ElButton @click="linkDialogVisible = false">
            取消
          </ElButton>
          <ElButton type="primary" @click="insertLink">
            确定
          </ElButton>
        </div>
      </template>
    </ElDialog>
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
.link-form {
  margin-bottom: 1.5rem;
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
