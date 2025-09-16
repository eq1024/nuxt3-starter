<script setup lang="ts">
import type { UploadProps, UploadRequestOptions } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useImageUpload } from '@/composables/useImageUpload'

const emit = defineEmits(['uploaded'])
const { loading, uploadImage } = useImageUpload()

async function customUpload(options: UploadRequestOptions) {
  try {
    const imageUrl = await uploadImage(options.file)
    emit('uploaded', imageUrl)
  }
  catch (error) {
    console.error('Upload failed in ImageUploader:', error)
    // Message is handled in composable
  }
}

const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('Avatar picture must be JPG or PNG format!')
    return false
  }
  else if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error('Avatar picture size can not exceed 5MB!')
    return false
  }
  return true
}
</script>

<template>
  <el-upload
    v-loading="loading"
    class="image-uploader"
    accept="image/*"
    :show-file-list="false"
    :before-upload="beforeUpload"
    :http-request="customUpload"
  >
    <slot>
      <div class="placeholder-content">
        <Icon name="carbon:add-alt" class="text-10" />
      </div>
    </slot>
  </el-upload>
</template>

<style scoped>
.image-uploader {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.image-uploader :deep(.el-upload) {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}
.image-uploader :deep(.el-upload:hover) {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
}
.placeholder-content {
  color: var(--el-text-color-placeholder);
  text-align: center;
}
</style>
