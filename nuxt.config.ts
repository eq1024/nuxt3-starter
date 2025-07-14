import process from 'node:process'
import { appDescription } from './constants/index'
import { currentLocales } from './i18n'

export default defineNuxtConfig({
  modules: ['@vueuse/nuxt', '@pinia/nuxt', 'nuxt-lodash', '@unocss/nuxt', '@element-plus/nuxt', '@nuxtjs/i18n', '@nuxt/icon'],

  experimental: {
    payloadExtraction: false,
  },

  /**
   * redirect - Define server-side redirects.
ssr - 禁用应用程序部分的服务器端渲染，并使用ssr: false使它们仅用于spa。
cors - 自动添加带有cors: true的cors报头-你可以通过用headers覆盖自定义输出
headers - 为站点的各个部分添加特定的标题-例如，您的资产
static and swr - static支持单个(按需)构建;swr启用静态构建，该构建持续一个可配置的TTL。(目前在Netlify上支持完全增量静态生成，Vercel很快就会推出)
   */
  routeRules: {
    // 区分大小写,关闭ssr后,http的doc返回的是空白文档
    '/admin/**': { ssr: false },
    '/test/**': { ssr: false },
  },

  devtools: {
    enabled: true,
  },

  css: [
    '@/static/css/normalize.css',
    // 'naive-ui/style/index.css',
  ],

  runtimeConfig: {
    public: {
      BASE_URL: process.env.NUXT_BASE_ROOT,
      test: 'test value',
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
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      crawlLinks: false,
      routes: ['/'],
      /**
       * 浏览器访问会自动匹配目录下的index.html
       * 但是nitro不会,所以造成服务端认为404 客户端又找得到
       * 需要将文件目录加入到ignore中,以保证浏览器访问正常
       */
      // ignore: ['/admin'],
    },
    devProxy: {
      'https://imgapi.cn/cos2.php?return=json': {
        target: 'https://imgapi.cn/cos2.php?return=json',
        prependPath: true,
        changeOrigin: true,
      },
    },
    // routeRules: {
    //   '/admin/**': {
    //     headers: {
    //       'Access-Control-Allow-Origin': '*',
    //     },
    //     ssr: false,
    //   },
    // },
  },

  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/nuxt.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: appDescription },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
      script: [],
    },
  },

  compatibilityDate: '2025-04-14',
})
