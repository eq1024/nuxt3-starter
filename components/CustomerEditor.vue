<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import FormattedText from './FormattedText.vue'

const props = defineProps<{
  tutorial: App.TreeNode[]
  depth: number
  path: number[]
  activeEditorPath: number[] | null
}>()

const emit = defineEmits(['update:tutorial', 'moveNodeUp', 'setActiveEditor'])

const { t } = useI18n()

// This watcher is now only for restoring state after a node move.
watch(() => props.tutorial, (newTutorial, _oldTutorial) => {
  // Ensure there's always at least one item to edit
  if (!newTutorial || newTutorial.length === 0) {
    const newRow: App.TreeNode = {
      'row-text': 'insert text here',
      'children': [],
      'type': 1,
    }
    // Avoid mutation during render; emit an update instead.
    nextTick(() => {
      emit('update:tutorial', [newRow])
    })
    return // Exit early to avoid processing an empty/stale array
  }

  nextTick(() => {
    let foundPath: number[] | null = null
    newTutorial.forEach((node, index) => {
      if (node._shouldBeEditing) {
        foundPath = [...props.path, index]
        delete node._shouldBeEditing
      }
    })
    if (foundPath)
      emit('setActiveEditor', foundPath)
  })
}, { deep: true, immediate: true })

const linkDialogVisible = ref(false)
const linkForm = ref({
  text: '',
  url: '',
  newWindow: true,
})

function isEditing(index: number): boolean {
  if (!props.activeEditorPath)
    return false
  if (props.activeEditorPath.length !== props.path.length + 1)
    return false

  const currentPath = [...props.path, index]
  return JSON.stringify(currentPath) === JSON.stringify(props.activeEditorPath)
}

function toggleEdit(index: number) {
  const currentPath = [...props.path, index]
  if (isEditing(index)) {
    // If it's already being edited, clicking again closes it.
    emit('setActiveEditor', null)
  }
  else {
    emit('setActiveEditor', currentPath)
  }
}

function insertFormatting(format: string, row: App.TreeNode, _index: number) {
  const textarea = document.querySelector('.input-area') as HTMLTextAreaElement
  if (!textarea)
    return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = row['row-text'].substring(start, end)

  let formattedText = format

  if (format === 'bold')
    formattedText = `***${selectedText}***`
  else if (format === 'italic')
    formattedText = `~~${selectedText}~~`
  else if (format === 'underline')
    formattedText = `++${selectedText}++`

  row['row-text'] = row['row-text'].substring(0, start) + formattedText + row['row-text'].substring(end)

  setTimeout(() => {
    textarea.focus()
    if (selectedText) {
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length)
    }
    else {
      let cursorPosition = start
      if (format === 'bold')
        cursorPosition = start + 3
      else if (format === 'italic')
        cursorPosition = start + 2
      else if (format === 'underline')
        cursorPosition = start + 2
      textarea.setSelectionRange(cursorPosition, cursorPosition)
    }
  }, 0)
}

function openLinkDialog(row: App.TreeNode) {
  const textarea = document.querySelector('.input-area') as HTMLTextAreaElement
  if (!textarea)
    return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = row['row-text'].substring(start, end)

  linkForm.value = {
    text: selectedText,
    url: '',
    newWindow: true,
  }

  linkDialogVisible.value = true
}

function insertLink(row: App.TreeNode) {
  const textarea = document.querySelector('.input-area') as HTMLTextAreaElement
  if (!textarea || !linkForm.value.url)
    return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd

  const linkText = linkForm.value.text || linkForm.value.url
  const newWindowParam = linkForm.value.newWindow ? '|new_window=true' : ''
  const linkString = `[${linkText}|${linkForm.value.url}${newWindowParam}|]`

  row['row-text'] = row['row-text'].substring(0, start) + linkString + row['row-text'].substring(end)

  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(start + linkString.length, start + linkString.length)
  }, 0)

  linkDialogVisible.value = false
}

function closeEditor() {
  emit('setActiveEditor', null) // Close editor
}

function addContent(index: number) {
  const newRow: App.TreeNode = {
    'row-text': '',
    'children': [],
    'type': 0,
  }
  props.tutorial.splice(index + 1, 0, newRow)
  const newPath = [...props.path, index + 1]
  emit('setActiveEditor', newPath)
  emit('update:tutorial', props.tutorial)
}

function removeContent(index: number) {
  const currentPath = [...props.path, index]
  // If the deleted node was the one being edited, close the editor.
  if (JSON.stringify(currentPath) === JSON.stringify(props.activeEditorPath))
    emit('setActiveEditor', null)

  props.tutorial.splice(index, 1)
  emit('update:tutorial', props.tutorial)
}

function moveToParentLevel(index: number) {
  if (props.depth === 0)
    return

  const currentNode = props.tutorial[index]
  if (isEditing(index))
    currentNode._shouldBeEditing = true

  emit('moveNodeUp', {
    node: currentNode,
    currentIndex: index,
    path: props.path,
  })
}

function demoteToPreviousSiblingChild(index: number) {
  if (index === 0)
    return

  const currentNode = props.tutorial[index]
  if (isEditing(index))
    currentNode._shouldBeEditing = true

  const previousNode = props.tutorial[index - 1]
  const [nodeToMove] = props.tutorial.splice(index, 1)

  if (previousNode) {
    if (!previousNode.children)
      previousNode.children = []

    previousNode.children.push(nodeToMove)
    // The watcher will handle setting the new active path.
    emit('setActiveEditor', null) // Temporarily close editor
    emit('update:tutorial', props.tutorial)
  }
}

function handleMoveNodeUp(event: { node: App.TreeNode, currentIndex: number, path: number[] }) {
  emit('moveNodeUp', event)
}

function handleSetActiveEditor(path: number[] | null) {
  emit('setActiveEditor', path)
}
</script>

<template>
  <div v-for="(row, index) in props.tutorial" :key="index" class="editor-container">
    <div v-if="row.children && row.children.length > 0" class="my-4px" :style="{ 'margin-left': '20px' }">
      <div v-if="isEditing(index)" class="formatted-text-editor">
        <div class="toolbar">
          <ElButton circle @click="insertFormatting('bold', row, index)">
            <Icon name="carbon:text-bold" />
          </ElButton>
          <ElButton circle @click="insertFormatting('italic', row, index)">
            <Icon name="carbon:text-italic" />
          </ElButton>
          <ElButton circle @click="insertFormatting('underline', row, index)">
            <Icon name="carbon:text-underline" />
          </ElButton>
          <ElButton circle @click="openLinkDialog(row)">
            <Icon name="carbon:link" />
          </ElButton>
          <ElButton circle @click="closeEditor()">
            <Icon name="carbon:caret-up " />
          </ElButton>
        </div>
        <textarea
          v-model="row['row-text']"
          class="input-area"
          placeholder=""
        />
        <div class="flex">
          <ElButton circle :disabled="index === 0" @click="demoteToPreviousSiblingChild(index)">
            <Icon name="carbon:text-indent-more" />
          </ElButton>
          <ElButton circle :disabled="depth === 0" @click="moveToParentLevel(index)">
            <Icon name="carbon:text-indent-less" />
          </ElButton>
          <ElButton circle @click="addContent(index)">
            <Icon name="carbon:add" />
          </ElButton>
          <ElButton circle @click="removeContent(index)">
            <Icon name="carbon:trash-can" />
          </ElButton>
        </div>
      </div>
      <div v-else class="flex items-start mb-6px">
        <LineMark v-model:type="row.type" />
        <FormattedText class="cursor-pointer" :content="row['row-text']" @click="toggleEdit(index)" />
      </div>
      <ElDialog
        v-model="linkDialogVisible"
        :title="t('customerEditor.dialog.insertLink.title')"
        :close-on-click-modal="false"
        width="400px"
      >
        <ElForm class="link-form" label-position="top">
          <ElFormItem :label="t('customerEditor.dialog.insertLink.textLabel')">
            <ElInput v-model="linkForm.text" :placeholder="t('customerEditor.dialog.insertLink.textPlaceholder')" />
          </ElFormItem>
          <ElFormItem :label="t('customerEditor.dialog.insertLink.urlLabel')">
            <ElInput v-model="linkForm.url" :placeholder="t('customerEditor.dialog.insertLink.urlPlaceholder')" />
          </ElFormItem>
          <ElFormItem>
            <ElCheckbox v-model="linkForm.newWindow">
              {{ t('customerEditor.dialog.insertLink.newWindow') }}
            </ElCheckbox>
          </ElFormItem>
        </ElForm>
        <template #footer>
          <div class="dialog-footer">
            <ElButton @click="linkDialogVisible = false">
              {{ t('common.cancel') }}
            </ElButton>
            <ElButton type="primary" @click="insertLink(row)">
              {{ t('common.confirm') }}
            </ElButton>
          </div>
        </template>
      </ElDialog>
      <CustomerEditor
        v-model:tutorial="row.children"
        :depth="depth + 1"
        :path="[...props.path, index]"
        :active-editor-path="props.activeEditorPath"
        @set-active-editor="handleSetActiveEditor"
        @move-node-up="handleMoveNodeUp"
      />
    </div>
    <div v-else class="my-4px" :style="{ 'margin-left': '20px' }">
      <div v-if="isEditing(index)" class="formatted-text-editor">
        <div class="toolbar">
          <ElButton circle @click="insertFormatting('bold', row, index)">
            <Icon name="carbon:text-bold" />
          </ElButton>
          <ElButton circle @click="insertFormatting('italic', row, index)">
            <Icon name="carbon:text-italic" />
          </ElButton>
          <ElButton circle @click="insertFormatting('underline', row, index)">
            <Icon name="carbon:text-underline" />
          </ElButton>
          <ElButton circle @click="openLinkDialog(row)">
            <Icon name="carbon:link" />
          </ElButton>
          <ElButton circle @click="closeEditor()">
            <Icon name="carbon:caret-up" />
          </ElButton>
        </div>

        <textarea
          v-model="row['row-text']"
          class="input-area"
          placeholder=""
        />
        <div class="mt-2 flex">
          <ElButton circle :disabled="index === 0" @click="demoteToPreviousSiblingChild(index)">
            <Icon name="carbon:text-indent-more" />
          </ElButton>
          <ElButton circle :disabled="depth === 0" @click="moveToParentLevel(index)">
            <Icon name="carbon:text-indent-less" />
          </ElButton>
          <ElButton circle @click="addContent(index)">
            <Icon name="carbon:add" />
          </ElButton>
          <ElButton circle @click="removeContent(index)">
            <Icon name="carbon:trash-can" />
          </ElButton>
        </div>
      </div>
      <div v-else class="flex items-start mb-6px">
        <LineMark v-model:type="row.type" />
        <FormattedText class="cursor-pointer" :content="row['row-text']" @click="toggleEdit(index)" />
      </div>
      <ElDialog
        v-model="linkDialogVisible"
        :title="t('customerEditor.dialog.insertLink.title')"
        :close-on-click-modal="false"
        width="400px"
      >
        <ElForm class="link-form" label-position="top">
          <ElFormItem :label="t('customerEditor.dialog.insertLink.textLabel')">
            <ElInput v-model="linkForm.text" :placeholder="t('customerEditor.dialog.insertLink.textPlaceholder')" />
          </ElFormItem>
          <ElFormItem :label="t('customerEditor.dialog.insertLink.urlLabel')">
            <ElInput v-model="linkForm.url" :placeholder="t('customerEditor.dialog.insertLink.urlPlaceholder')" />
          </ElFormItem>
          <ElFormItem>
            <ElCheckbox v-model="linkForm.newWindow">
              {{ t('customerEditor.dialog.insertLink.newWindow') }}
            </ElCheckbox>
          </ElFormItem>
        </ElForm>
        <template #footer>
          <div class="dialog-footer">
            <ElButton @click="linkDialogVisible = false">
              {{ t('common.cancel') }}
            </ElButton>
            <ElButton type="primary" @click="insertLink(row)">
              {{ t('common.confirm') }}
            </ElButton>
          </div>
        </template>
      </ElDialog>
    </div>
  </div>
</template>

<style scoped>
.formatted-text-editor{
  background-color: #cccccc65;
  padding:4px ;
  box-sizing: border-box;
  border-radius: 4px;
  margin-bottom: 4px;
  width: 100%;
}
.toolbar {
  background-color: #cccccc65;
  padding:4px ;
  box-sizing: border-box;
  border-radius: 4px;
  margin-bottom: 4px;
  width: 100%;
}
.input-area {
  box-sizing: border-box;
  width: 100%;
  height: 100px;
  padding: 0.5rem;
  font-size: 14px;
  outline: none ;
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
