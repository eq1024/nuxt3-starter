<script setup lang="ts">
import { Canvas, Circle, FabricImage, Rect } from 'fabric'
import { useImageUpload } from '@/composables/useImageUpload'
// import { nextTick, onMounted, ref, watch } from 'vue'
import lineColors from '@/constants/line'

const props = defineProps<{
  imageUrl: string
}>()

const emit = defineEmits(['saved'])
const { loading: isUploading, uploadImage } = useImageUpload()

const canvasEl = ref<HTMLCanvasElement | null>(null)
const canvas = ref<Canvas | null>(null)
const tool = ref('circle')
const colors = lineColors.slice(0, 8)
const selectedColor = ref(colors[0].color)
const hasActiveObject = ref(false)
const isLoading = ref(true)

function setTool(newTool: string) {
  tool.value = newTool
  if (canvas.value) {
    canvas.value.selection = newTool === 'select'
  }
}

function deleteSelected() {
  if (canvas.value) {
    const activeObject = canvas.value.getActiveObject()
    if (activeObject) {
      canvas.value.remove(activeObject)
    }
  }
}

function setColor(newColor: string) {
  selectedColor.value = newColor
  if (canvas.value) {
    const activeObject = canvas.value.getActiveObject()
    if (activeObject) {
      activeObject.set('stroke', newColor)
      canvas.value.renderAll()
    }
  }
}

function dataURLtoBlob(dataurl: string): Blob | null {
  const arr = dataurl.split(',')
  const mimeMatch = arr[0].match(/:(.*?);/)
  if (!mimeMatch)
    return null
  const mime = mimeMatch[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--)
    u8arr[n] = bstr.charCodeAt(n)

  return new Blob([u8arr], { type: mime })
}

async function saveCanvas() {
  if (canvas.value) {
    const dataUrl = canvas.value.toDataURL()
    const blob = dataURLtoBlob(dataUrl)
    if (blob) {
      try {
        const imageUrl = await uploadImage(blob, 'drawn-image.png')
        emit('saved', imageUrl)
        ElMessage.success('Markup saved and uploaded!')
      }
      catch (error) {
        console.error('Upload failed:', error)
        // ElMessage is already handled in useImageUpload
      }
    }
    else {
      ElMessage.error('Could not convert canvas to blob.')
    }
  }
}

function loadImage(url: string, fabricCanvas: Canvas) {
  console.log('Dwdwaddadaw')

  if (!url) {
    isLoading.value = false
    return
  }
  isLoading.value = true
  const img = new Image()
  let imageUrl = url

  // If the URL is a regular http/https URL, use the proxy.
  // If it's a Base64 string (data:...), use it directly.
  if (url.startsWith('http')) {
    imageUrl = `/image-proxy?url=${encodeURIComponent(url)}`
    isLoading.value = false
  }
  else {
    // For Base64 (or other direct data), crossOrigin is not an issue.
  }

  img.onload = () => {
    const fabricImg = new FabricImage(img)
    fabricImg.scaleToWidth(800)
    fabricImg.scaleToHeight(600)
    fabricCanvas.backgroundImage = fabricImg
    fabricCanvas.renderAll()
    isLoading.value = false
  }
  img.onerror = (err) => {
    console.error('Error loading image:', err)
    ElMessage.error('Could not load the image for drawing.')
    isLoading.value = false
  }
  img.src = imageUrl
}

onMounted(() => {
  nextTick(() => {
    if (canvasEl.value) {
      console.log('32311233')

      const fabricCanvas = new Canvas(canvasEl.value)
      canvas.value = fabricCanvas
      fabricCanvas.selection = false

      loadImage(props.imageUrl, fabricCanvas)

      fabricCanvas.on('mouse:down', (options) => {
        if (options.target || !options.viewportPoint)
          return

        const pointer = options.viewportPoint
        let shape
        if (tool.value === 'circle') {
          shape = new Circle({
            left: pointer.x,
            top: pointer.y,
            radius: 30,
            fill: 'transparent',
            stroke: selectedColor.value,
            strokeWidth: 3,
            originX: 'center',
            originY: 'center',
          })
        }
        else if (tool.value === 'rect') {
          shape = new Rect({
            left: pointer.x,
            top: pointer.y,
            width: 60,
            height: 60,
            fill: 'transparent',
            stroke: selectedColor.value,
            strokeWidth: 3,
            originX: 'center',
            originY: 'center',
          })
        }
        if (shape)
          fabricCanvas.add(shape)
      })

      fabricCanvas.on('selection:created', () => {
        hasActiveObject.value = true
      })

      fabricCanvas.on('selection:cleared', () => {
        hasActiveObject.value = false
      })
    }
  })
})

watch(() => props.imageUrl, (newUrl: string) => {
  if (canvas.value && canvas.value instanceof Canvas)
    loadImage(newUrl, canvas.value)
})
</script>

<template>
  <ClientOnly>
    <div class="draw-container">
      <div v-if="isLoading" class="loading-overlay">
        <el-skeleton animated>
          <template #template>
            <div class="toolbar-skeleton" />
            <el-skeleton-item variant="image" style="width: 100%; height: 600px;" />
          </template>
        </el-skeleton>
      </div>

      <!-- Toolbar -->
      <div class="toolbar">
        <div class="toolbar-section">
          <span class="toolbar-label">Tool:</span>
          <el-button-group>
            <el-button

              :type="tool === 'circle' ? 'primary' : 'default'"
              @click="setTool('circle')"
            >
              <Icon name="carbon:circle-outline" />
              Circle
            </el-button>
            <el-button

              :type="tool === 'rect' ? 'primary' : 'default'"
              @click="setTool('rect')"
            >
              <Icon name="carbon:square-outline" />
              Rectangle
            </el-button>
          </el-button-group>
        </div>

        <div class="toolbar-section">
          <span class="toolbar-label">Color:</span>
          <div class="color-palette">
            <div
              v-for="color in colors"
              :key="color.color"
              class="color-swatch"
              :style="{ backgroundColor: color.color }"
              :class="{ active: selectedColor === color.color }"
              :title="color.name"
              @click="setColor(color.color)"
            />
          </div>
        </div>

        <div class="toolbar-section">
          <span class="toolbar-label">Actions:</span>
          <el-button-group>
            <el-button

              type="danger"
              :disabled="!hasActiveObject"
              @click="deleteSelected"
            >
              <Icon name="carbon:trash-can" />
              Delete
            </el-button>
            <el-button

              type="success"
              :loading="isUploading"
              @click="saveCanvas"
            >
              <Icon name="carbon:save" />
              {{ isUploading ? 'Uploading...' : 'Save Markup' }}
            </el-button>
          </el-button-group>
        </div>
      </div>

      <!-- Canvas Area -->
      <div class="canvas-wrapper">
        <canvas ref="canvasEl" width="800" height="600" />
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped>
.draw-container {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 10;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 12px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
  padding: 16px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.toolbar-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar-label {
  font-size: 14px;
  font-weight: 500;
  color: #495057;
  white-space: nowrap;
}

.color-palette {
  display: flex;
  gap: 6px;
  padding: 4px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.color-swatch {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  border: 3px solid transparent;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.color-swatch:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.color-swatch.active {
  border-color: #409eff;
  transform: scale(1.15);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}

.color-swatch.active::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.canvas-wrapper {
  display: flex;
  justify-content: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px solid #e9ecef;
}

canvas {
  border: 2px solid #dee2e6;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: white;
  transition: box-shadow 0.3s ease;
}

canvas:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.toolbar-skeleton {
  height: 64px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 16px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .draw-container {
    padding: 16px;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .toolbar-section {
    justify-content: center;
    flex-wrap: wrap;
  }

  .color-palette {
    justify-content: center;
  }

  .canvas-wrapper {
    padding: 8px;
  }

  canvas {
    max-width: 100%;
    height: auto;
  }
}

/* Light Theme Optimization */
.draw-container {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
}

.toolbar {
  background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
  border: 1px solid #cbd5e1;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.toolbar-label {
  color: #334155;
  font-weight: 600;
}

.color-palette {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.canvas-wrapper {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #cbd5e1;
}

canvas {
  border: 1px solid #94a3b8;
  background: #ffffff;
}

/* Animations */
.toolbar-section {
  transition: all 0.2s ease;
}

.canvas-wrapper {
  transition: all 0.3s ease;
}

/* Tool Button Enhancements */
.el-button-group .el-button {
  transition: all 0.2s ease;
}

.el-button-group .el-button:hover {
  transform: translateY(-1px);
}

.el-button-group .el-button.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
