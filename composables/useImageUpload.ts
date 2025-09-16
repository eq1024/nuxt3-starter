import { ElMessage } from 'element-plus'
import { ref } from 'vue'

export function useImageUpload() {
  const loading = ref(false)
  const config = useRuntimeConfig()

  const uploadImage = async (file: File | Blob, fileName: string = 'image.png'): Promise<string> => {
    loading.value = true

    const formData = new FormData()
    formData.append('images', file, fileName)

    const token = useCookie('factoryToken').value
    if (!token) {
      ElMessage.error('Authentication token not found.')
      loading.value = false
      return Promise.reject(new Error('Authentication token not found.'))
    }

    try {
      const response = await fetch(`${config.public.apiBase}self-repair/image/uploadImage`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Upload failed: ${response.status} - ${errorText}`)
      }

      const responseData = await response.json()

      if (responseData && responseData.data) {
        ElMessage.success('Upload succeeded!')
        return responseData.data
      }
      else {
        throw new Error('Upload succeeded but no data URL was returned.')
      }
    }
    catch (e: any) {
      ElMessage.error(`Upload failed: ${e.message}`)
      throw e
    }
    finally {
      loading.value = false
    }
  }

  return {
    loading,
    uploadImage,
  }
}
