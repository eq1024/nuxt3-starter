<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useUserStore } from '~/store/user'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()

const loginFormRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({
  account: 'testuser',
  password: 'password123',
  captcha: '1234',
})

const loginRules = computed<FormRules>(() => ({
  account: [{ required: true, message: t('login.usernamePlaceholder'), trigger: 'blur' }],
  password: [{ required: true, message: t('login.passwordPlaceholder'), trigger: 'blur' }],
  captcha: [{ required: true, message: t('login.captchaPlaceholder'), trigger: 'blur' }],
}))

const captchaImage = ref('')

async function refreshCaptcha() {
  // Use a placeholder service for the captcha image
  captchaImage.value = `https://dummyimage.com/120x40/e0e0e0/757575.png&text=Mock${Math.random().toString().slice(2, 6)}`
}

async function handleLogin() {
  if (!loginFormRef.value)
    return
  try {
    await loginFormRef.value.validate()
    loading.value = true

    // --- Mock Login Logic ---
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay

    if (loginForm.account && loginForm.password && loginForm.captcha) {
      const mockToken = 'Bearer mock_access_token_string_for_testing_purposes'
      userStore.setToken(mockToken)

      // No need to manually set user info, as the middleware will call the mocked getUserInfo
      await userStore.getUserInfo()

      ElMessage.success(t('login.loginSuccess'))
      router.push('/')
    }
    else {
      throw new Error('Invalid credentials')
    }
    // --- End Mock Login Logic ---
  }
  catch (error) {
    await refreshCaptcha()
    loginForm.captcha = ''
    ElMessage.error('Login failed. Please try again.')
    console.error('Login failed or validation failed', error)
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  refreshCaptcha()
})
</script>

<template>
  <div class="login-container bg-gray-100 dark:bg-gray-900">
    <div class="login-card bg-white dark:bg-gray-800">
      <div class="card-header">
        <NuxtLink to="/">
          <img src="/logo/Silvervale.png" alt="Logo" class="h-16 rounded-lg mx-auto">
        </NuxtLink>
        <h1 class="text-2xl font-bold mt-4 text-gray-800 dark:text-white">
          Welcome Back
        </h1>
        <p class="text-gray-500 dark:text-gray-400">
          Sign in to continue to your account.
        </p>
      </div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-position="top"
        class="mt-6"
        @submit.prevent="handleLogin"
        @keydown.enter="handleLogin"
      >
        <el-form-item :label="t('login.usernameLabel')" prop="account">
          <el-input v-model="loginForm.account" :placeholder="t('login.usernamePlaceholder')" size="large" clearable>
            <template #prefix>
              <Icon name="carbon:user" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item :label="t('login.passwordLabel')" prop="password">
          <el-input v-model="loginForm.password" type="password" :placeholder="t('login.passwordPlaceholder')" size="large" show-password clearable>
            <template #prefix>
              <Icon name="carbon:locked" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item :label="t('login.captchaLabel')" prop="captcha">
          <div class="captcha-wrapper">
            <el-input v-model="loginForm.captcha" :placeholder="t('login.captchaPlaceholder')" size="large" clearable class="captcha-input">
              <template #prefix>
                <Icon name="carbon:qr-code" />
              </template>
            </el-input>
            <div class="captcha-image-container">
              <img v-if="captchaImage" class="captcha-image" :src="captchaImage" :alt="t('login.captchaAlt')" @click="refreshCaptcha">
              <div v-else class="captcha-placeholder" />
            </div>
          </div>
        </el-form-item>
        <el-form-item class="mt-6">
          <el-button type="primary" class="login-btn" native-type="submit" size="large" :loading="loading">
            {{ t('login.loginButton') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px); /* Full height minus header */
}
.login-card {
  width: 450px;
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
.card-header {
  text-align: center;
}
.captcha-wrapper {
  display: flex;
  width: 100%;
  gap: 1rem;
}
.captcha-input {
  flex-grow: 1;
}
.captcha-image-container {
  width: 120px;
  height: 40px;
  flex-shrink: 0;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  overflow: hidden;
}
.captcha-image {
  width: 100%;
  height: 100%;
  cursor: pointer;
  object-fit: cover;
  transition: opacity 0.3s;
}
.captcha-image:hover {
  opacity: 0.8;
}
.captcha-placeholder {
  width: 100%;
  height: 100%;
  background-color: #f5f7fa;
}
.login-btn {
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
  font-weight: 600;
}
</style>
