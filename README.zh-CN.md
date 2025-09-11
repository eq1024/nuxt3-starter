# Nuxt 3 企业级入门套件

<p align="right">
  <a href="./README.md">English</a> | <b>简体中文</b>
</p>

一个功能丰富、企业级的 Nuxt 3 入门套件。旨在为构建现代化、可扩展且易于维护的 Web 应用程序提供坚实的开发基础。

---

## ✨ 功能特性

该入门套件预置了丰富的功能，旨在加速您的开发流程：

-   **🚀 现代化技术栈**: 基于 **Nuxt 3**、**Vite** 和 **TypeScript**，提供强大且类型安全的开发体验。
-   **🎨 UI 与样式**:
    -   **Element Plus**: 集成了广受欢迎的 UI 组件库。
    -   **UnoCSS**: 按需、原子的 CSS 引擎，实现快速高效的样式开发。
    -   **Iconify**: 通过 `@nuxt/icon` 轻松使用数万个图标，已预设 Carbon 图标集。
-   **🗃️ 状态管理**:
    -   **Pinia**: Vue 官方推荐的、直观的状态管理库。
    -   **持久化状态**: 使用 `pinia-plugin-persistedstate` 插件，轻松实现会话保持。
-   **🌐 国际化 (i18n)**:
    -   **@nuxtjs/i18n**: 全面支持多语言。
    -   **自动语言检测**: 可根据用户浏览器语言自动重定向。
-   **🔐 高级权限控制**:
    -   **路由级守卫**: 全局中间件，用于在路由切换前进行用户身份验证。
    -   **组件级控制**: 自定义 `v-permission` 指令，可根据用户角色和权限精细控制页面元素的可见性。
-   **🛠️ 开发者体验**:
    -   **ESLint**: 使用 `@antfu/eslint-config` 进行严格的代码规范检查。
    -   **VueUse**: 提供一整套实用的组合式函数集合。
    -   **自动导入**: 组件、组合式函数和工具函数均可自动导入。
    -   **Dotenv 支持**: 轻松管理不同环境（如 `.env.dev`, `.env.production`）的配置文件。
-   **🔌 预集成模块**:
    -   **富文本编辑器**: `WangEditor` 用于内容创建。
    -   **图片裁剪**: `vue-cropper` 用于图像处理。
    -   **拖拽功能**: `vue-draggable-next` 用于实现交互式列表。
-   **📦 网络请求与上传**:
    -   **请求封装**: 基于 `$fetch` 封装了 `useRequest`，提供统一的 `BaseURL`、认证头和错误处理。
    -   **图片上传**: 封装了 `useImageUpload`，简化了文件上传逻辑并提供加载状态。

---

## ⚙️ 权限指令 (`v-permission`)

通过精细的逻辑控制元素的可见性。

-   **用法**: `v-permission="[权限ID, 用户类型, 品牌名称]"`
-   **示例**:
    -   `v-permission="[22, 1, 'some-brand']"`: 检查权限 `22`、用户类型 `1` 和品牌名称 `'some-brand'`。
    -   `v-permission="[22, [1, 2]]"`: 检查权限 `22` 以及用户类型是否为 `1` 或 `2`。
    -   `v-permission="[22, null, 'covos']"`: 跳过用户类型检查。
    -   `v-permission="[22]"`: 仅检查权限 `22`。
    -   `v-permission:debug="[22]"`: 启用指令的调试模式，日志将输出到控制台。

---

## 🚀 服务端部署

### 环境要求

-   Node.js >= 22
-   pnpm
-   pm2

### 安装步骤

1.  **安装 NVM (Node 版本管理器)**
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
    source ~/.bashrc
    ```

2.  **安装并使用 Node.js v22**
    ```bash
    nvm install 22
    nvm use 22
    ```

3.  **安装全局依赖**
    ```bash
    npm install -g pnpm pm2
    ```

4.  **安装项目依赖**
    ```bash
    pnpm install
    ```

5.  **启动服务**
    ```bash
    pnpm dev
    ```
