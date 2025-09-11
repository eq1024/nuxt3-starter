<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import { VueCropper } from 'vue-cropper'
import { useImageUpload } from '@/composables/useImageUpload'
import 'vue-cropper/dist/index.css'

const props = defineProps<{
  imageUrl: string
}>()

const emit = defineEmits(['cropped'])
const { loading: isCropping, uploadImage } = useImageUpload()

const cropperRef = ref<any>(null)
const currentResolution = ref({ width: 0, height: 0 })
const isLoading = ref(false)
const processedImageUrl = ref('')

const MIN_CROP_WIDTH = 800
const MIN_CROP_HEIGHT = 600

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

// Handle cross-origin images, similar to Draw.vue
function processImageUrl(url: string): string {
  if (!url)
    return ''

  // If it's a Base64 data URL or a local path, use it directly
  if (url.startsWith('data:') || url.startsWith('/') || url.startsWith('./')) {
    return url
  }

  // If it's an external HTTP/HTTPS link, use the proxy
  if (url.startsWith('http')) {
    return `/image-proxy?url=${encodeURIComponent(url)}`
  }

  return url
}

function updateResolution() {
  if (!cropperRef.value)
    return
  try {
    const cropData = cropperRef.value.getData(true)
    currentResolution.value = {
      width: Math.round(cropData.width),
      height: Math.round(cropData.height),
    }
  }
  catch (error) {
    console.error('Failed to update resolution:', error)
    currentResolution.value = { width: 0, height: 0 }
  }
}

function handleReady() {
  if (!cropperRef.value)
    return

  try {
    // Ensure the image has finished loading
    setTimeout(() => {
      if (!cropperRef.value)
        return

      const imageData = cropperRef.value.getImageData()
      const canvasData = cropperRef.value.getCanvasData()

      // Check if the image data is valid
      if (imageData && imageData.naturalWidth > 0 && imageData.naturalHeight > 0) {
        const ratio = canvasData.width / imageData.naturalWidth

        cropperRef.value.setCropBoxData({
          width: MIN_CROP_WIDTH * ratio,
          height: MIN_CROP_HEIGHT * ratio,
        })
        updateResolution()
      }
      else {
        // If image data is invalid, retry after a delay
        setTimeout(() => handleReady(), 200)
      }
    }, 100)
  }
  catch (error) {
    console.error('Cropper initialization failed:', error)
    ElMessage.error('Cropper initialization failed')
  }
}

function handleCropEnd() {
  if (!cropperRef.value)
    return

  try {
    const cropData = cropperRef.value.getData(true)
    const cropBoxData = cropperRef.value.getCropBoxData()
    const newCropBoxData = { ...cropBoxData }
    let modified = false

    if (cropData.width < MIN_CROP_WIDTH) {
      const imageData = cropperRef.value.getImageData()
      const canvasData = cropperRef.value.getCanvasData()
      const ratio = canvasData.width / imageData.naturalWidth
      newCropBoxData.width = MIN_CROP_WIDTH * ratio
      modified = true
    }

    if (cropData.height < MIN_CROP_HEIGHT) {
      const imageData = cropperRef.value.getImageData()
      const canvasData = cropperRef.value.getCanvasData()
      const ratio = canvasData.height / imageData.naturalHeight
      newCropBoxData.height = MIN_CROP_HEIGHT * ratio
      modified = true
    }

    if (modified) {
      cropperRef.value.setCropBoxData(newCropBoxData)
      setTimeout(updateResolution, 50)
    }
    else {
      updateResolution()
    }
  }
  catch (error) {
    console.error('Crop end processing failed:', error)
  }
}

function cropImage() {
  if (!cropperRef.value) {
    ElMessage.error('Cropper not ready')
    return
  }

  try {
    cropperRef.value.getCropData(async (dataUrl: string) => {
      if (!dataUrl) {
        ElMessage.error('Crop failed, please try again')
        return
      }

      const blob = dataURLtoBlob(dataUrl)
      if (!blob) {
        ElMessage.error('Could not convert cropped data to Blob')
        return
      }

      try {
        const imageUrl = await uploadImage(blob, 'cropped-image.png')
        emit('cropped', imageUrl)
      }
      catch (uploadError) {
        console.error('Upload failed:', uploadError)
      }
    })
  }
  catch (error) {
    console.error('Failed to crop image:', error)
    ElMessage.error('Failed to crop image')
  }
}

function reset() {
  if (cropperRef.value) {
    try {
      // Reset the crop box to its initial state
      const imageData = cropperRef.value.getImageData()
      const canvasData = cropperRef.value.getCanvasData()

      if (imageData && imageData.naturalWidth > 0 && imageData.naturalHeight > 0) {
        const ratio = canvasData.width / imageData.naturalWidth

        // Reset the crop box
        cropperRef.value.setCropBoxData({
          left: (canvasData.width - MIN_CROP_WIDTH * ratio) / 2,
          top: (canvasData.height - MIN_CROP_HEIGHT * ratio) / 2,
          width: MIN_CROP_WIDTH * ratio,
          height: MIN_CROP_HEIGHT * ratio,
        })

        updateResolution()
        ElMessage.success('Reset successful')
      }
    }
    catch (error) {
      console.error('Failed to reset cropper:', error)
      ElMessage.error('Reset failed')
    }
  }
}

function handleImageError() {
  console.error('Image failed to load')
  ElMessage.error('Image failed to load, please check the image URL')
}

// Watch for changes in the image URL
watch(() => props.imageUrl, (newUrl: string) => {
  if (newUrl) {
    processedImageUrl.value = processImageUrl(newUrl)
  }
}, { immediate: true })

onMounted(() => {
  nextTick(() => {
    if (props.imageUrl) {
      processedImageUrl.value = processImageUrl(props.imageUrl)
    }
  })
})
</script>

<template>
  <ClientOnly>
    <div class="cropper-container">
      <!-- Toolbar -->
      <div class="toolbar">
        <div class="toolbar-section">
          <span class="toolbar-label">Crop Actions:</span>
          <el-button-group>
            <el-button
              type="primary"
              size="small"
              :loading="isCropping"
              @click="cropImage"
            >
              <Icon name="carbon:crop" />
              {{ isCropping ? 'Cropping...' : 'Confirm Crop' }}
            </el-button>
          </el-button-group>
        </div>
      </div>

      <!-- Cropper Body -->
      <div class="cropper-wrapper">
        <VueCropper
          v-if="processedImageUrl"
          ref="cropperRef"
          :key="processedImageUrl"
          :img="processedImageUrl"
          :auto-crop="true"
          :fixed-box="false"
          :center-box="true"
          :fixed="true"
          :fixed-number="[4, 3]"
          :auto-crop-width="400"
          :auto-crop-height="300"
          @ready="handleReady"
          @cropend="handleCropEnd"
          @cropmove="updateResolution"
          @cropstart="updateResolution"
          @crop="updateResolution"
          @error="handleImageError"
        />
      </div>

      <!-- Resolution Display -->
      <div class="resolution-display">
        <div class="resolution-tip">
          <Icon name="carbon:information" />
          <span>Minimum size requirement: {{ MIN_CROP_WIDTH }} × {{ MIN_CROP_HEIGHT }} pixels</span>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped>
.cropper-container {
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
  gap: 16px;
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

.cropper-wrapper {
  width: 100%;
  max-width: 800px;
  height: 500px;
  margin: 0 auto;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f9fa;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
}

.resolution-display {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  border-radius: 8px;
  border: 1px solid #bbdefb;
}

.resolution-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1976d2;
}

.resolution-text {
  font-family: 'Consolas', 'Monaco', monospace;
}

.resolution-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.toolbar-skeleton {
  height: 64px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 16px;
}

.actions-skeleton {
  height: 80px;
  background-color: #e3f2fd;
  border-radius: 8px;
  margin-top: 16px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .cropper-container {
    padding: 16px;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-section {
    justify-content: center;
  }

  .cropper-wrapper {
    height: 300px;
  }

  .resolution-display {
    padding: 12px;
  }

  .toolbar-label {
    font-size: 13px;
  }
}

/* Light Theme Optimization */
.cropper-container {
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

.cropper-wrapper {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #cbd5e1;
}

.resolution-display {
  background: linear-gradient(135deg, #f0f9ff 0%, #faf5ff 100%);
  border: 1px solid #bfdbfe;
}

.resolution-info {
  color: #1e40af;
}

.resolution-tip {
  color: #64748b;
}

/* Animations */
.cropper-wrapper {
  transition: all 0.3s ease;
}

.cropper-wrapper:hover {
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.1);
}

.toolbar-section {
  transition: all 0.2s ease;
}

.resolution-display {
  transition: all 0.3s ease;
}
</style>
