<script setup lang="ts">
import { ref } from 'vue'
import CustomerEditor from '~/components/CustomerEditor.vue'

const tutorialData = ref<App.TreeNode[]>([
  {
    'row-text': 'Welcome to the Customer Editor Demo!',
    'type': 1,
    'children': [
      {
        'row-text': 'This is a nested item.',
        'type': 0,
        'children': [],
      },
    ],
  },
  {
    'row-text': 'Click on any text to start editing.',
    'type': 0,
    'children': [],
  },
])

const activeEditorPath = ref<number[] | null>(null)

function handleSetActiveEditor(path: number[] | null) {
  activeEditorPath.value = path
}

function handleMoveNodeUp(event: { node: App.TreeNode, currentIndex: number, path: number[] }) {
  const { node, currentIndex, path } = event
  // Find parent array
  let parent = tutorialData.value
  for (let i = 0; i < path.length - 1; i++) {
    parent = parent[path[i]].children!
  }
  // Remove from current position
  parent.splice(currentIndex, 1)

  // Find new parent array and add to it
  let newParent = tutorialData.value
  const newPath = path.slice(0, -1)
  for (let i = 0; i < newPath.length - 1; i++) {
    newParent = newParent[newPath[i]].children!
  }
  const insertIndex = newPath[newPath.length - 1] + 1
  newParent.splice(insertIndex, 0, node)
}
</script>

<template>
  <div class="w-full relative overflow-hidden">
    <div class="gradient-bg" />
    <main class="container mx-auto px-6 py-24 relative z-10">
      <div class="text-center mb-16">
        <h1 class="text-5xl md:text-7xl font-extrabold tracking-tighter text-white mb-4">
          Content, Reimagined.
        </h1>
        <p class="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
          Experience a seamless, node-based editor. Effortlessly structure your ideas with intuitive controls and a clean, focused interface.
        </p>
      </div>

      <div class="max-w-5xl mx-auto bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-2xl shadow-gray-200/50 dark:shadow-black/20 p-6 sm:p-8 md:p-10">
        <div class="mb-10">
          <h2 class="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
            Key Features
          </h2>
          <ul class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-600 dark:text-gray-300">
            <li class="flex items-center">
              <Icon name="carbon:checkmark-outline" class="mr-3 text-green-500 text-xl" />Rich Text Formatting (Bold, Italic, Underline)
            </li>
            <li class="flex items-center">
              <Icon name="carbon:checkmark-outline" class="mr-3 text-green-500 text-xl" />Hierarchical Nesting & Indentation
            </li>
            <li class="flex items-center">
              <Icon name="carbon:checkmark-outline" class="mr-3 text-green-500 text-xl" />Dynamic Item Management (Add/Remove)
            </li>
            <li class="flex items-center">
              <Icon name="carbon:checkmark-outline" class="mr-3 text-green-500 text-xl" />Hyperlink Insertion
            </li>
            <li class="flex items-center">
              <Icon name="carbon:checkmark-outline" class="mr-3 text-green-500 text-xl" />Seamless Click-to-Edit Interface
            </li>
            <li class="flex items-center">
              <Icon name="carbon:checkmark-outline" class="mr-3 text-green-500 text-xl" />Customizable List Markers
            </li>
          </ul>
        </div>
        <div class="border-t border-gray-200 dark:border-gray-600 my-8" />
        <CustomerEditor
          v-model:tutorial="tutorialData"
          :depth="0"
          :path="[]"
          :active-editor-path="activeEditorPath"
          @set-active-editor="handleSetActiveEditor"
          @move-node-up="handleMoveNodeUp"
        />
      </div>
    </main>
  </div>
</template>

<style scoped>
.gradient-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
  z-index: 0;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
