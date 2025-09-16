<script setup lang="ts">
import { i18nChangeLanguage } from '@wangeditor-next/editor'
import { Editor, Toolbar } from '@wangeditor-next/editor-for-vue'
import '@wangeditor-next/editor/dist/css/style.css' // import css

const { t, locale } = useI18n()

// Editor instance, must use shallowRef
const editorRef = shallowRef()

// Content HTML
const valueHtml = defineModel('valueHtml', {
  default: '',
})

// Simulate ajax async fetch content
onMounted(() => {
  // wangEditor is not fully compatible with nuxt-i18n, so we need to manually switch the language.
  if ((locale.value as any) === 'zh-cn')
    i18nChangeLanguage('zh-CN')
  else
    i18nChangeLanguage('en')
})

const toolbarConfig = {
  toolbarKeys: [
    'italic',
    'bold',
    'underline',
    'insertLink',
    'numberedList',
    'bulletedList',
  ],
}
const editorConfig = { placeholder: t('richEditor.placeholder') }

// Destroy the editor when the component is unmounted
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null)
    return
  editor.destroy()
})

function handleCreated(editor: typeof Editor) {
  editorRef.value = editor // Record editor instance, important!
}
const mode = 'simple' // or 'simple'
</script>

<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :default-config="toolbarConfig"
      :mode="mode"
    />
    <Editor
      v-model="valueHtml"
      style="height: 300px; overflow-y: hidden;"
      :default-config="editorConfig"
      :mode="mode"
      @on-created="handleCreated"
    />
  </div>
</template>
