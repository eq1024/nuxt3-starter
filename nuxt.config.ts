import process from 'node:process'
import { appDescription } from './constants/index'
import { currentLocales } from './i18n'

export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-lodash',
    '@unocss/nuxt',
    '@element-plus/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/icon',
    'dayjs-nuxt',
  ],

  plugins: [
    '~/plugins/permission.ts',
  ],

  vite: {
    optimizeDeps: {
      exclude: ['element-plus'],
    },
  },

  elementPlus: {
    installMethods: ['ElLoading', 'ElMessage', 'ElMessageBox', 'ElNotification'],
  },

  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true,
  },

  devtools: {
    enabled: false,
  },

  css: [
    '@/public/css/normalize.css',
    '@/public/css/font.css',
    // 'element-plus/dist/index.css',
  ],

  runtimeConfig: {
    // Private keys are only available on the server
    apiBase: process.env.NUXT_API_BASE,
    // apiBase: process.env.NUXT_API_BASE || '192.168.2.169/api/',

    // Public keys that are exposed to the client
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
      stripeKey: process.env.NUXT_PUBLIC_STRIPE_KEY,
    },
  },

  i18n: {
    locales: currentLocales,
    restructureDir: '',
    langDir: 'locales/',
    defaultLocale: 'en',
    strategy: 'no_prefix',
    vueI18n: './i18n.config.ts',
    // 启用浏览器语言检测，以便在访问者第一次访问您的站点时自动将其重定向到首选语言环境。
    detectBrowserLanguage: {
      // 启动 cookie
      useCookie: true,
      // 用于存储当前语言环境的变量名
      cookieKey: 'i18n_redirected',
      // (建议用于改进SEO) -仅检测站点根路径(/)上的浏览器区域设置。只有当使用策略而不是“no_prefix”时才有效。
      redirectOn: 'root',
    },
  },

  nitro: {
    // 为 PM2 多实例部署优化
    // preset: 'node-cluster',  记得开启
    // devProxy: {
    //   '/dev': { // 需要代理的路径前缀
    //     target: 'http://api.xxxxx.com/api/', // 目标服务器地址
    //     // target: 'http://192.168.2.169/api/', // 目标服务器地址
    //     changeOrigin: true, // 修改请求头 Origin 为目标地址（解决跨域关键）
    //     prependPath: true, // 自动拼接路径（如 /api/user → 目标域名/api/user）
    //   },
    // },
    routeRules: {
      '/_nuxt_icon/**': { proxy: '/api/_nuxt_icon/**' },
    },
  },
  icon: {
    provider: 'iconify',
    customCollections: [
      {
        prefix: 'carbon',
        dir: './assets/icons/carbon',
      },
    ],
  },
  app: {
    baseURL: '/',
    head: {
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        // { rel: 'icon', type: 'image/svg+xml', href: '/nuxt.svg' },
        // { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: appDescription },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
      script: [
        {
          src: 'https://js.stripe.com/basil/stripe.js',
        },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },

  compatibilityDate: '2025-04-14',
})
