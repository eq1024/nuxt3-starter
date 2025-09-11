# Nuxt 3 Enterprise Starter Kit

<p align="right">
  <a href="./README.md">English</a> | <b>简体中文</b>
</p>

A feature-rich, enterprise-grade starter kit for Nuxt 3. Designed to provide a solid foundation for building modern, scalable, and maintainable web applications.

---

## ✨ Features

This starter kit comes packed with a wide range of pre-configured features to accelerate your development process:

-   **🚀 Modern Tech Stack**: **Nuxt 3**, **Vite**, and **TypeScript** for a powerful and type-safe development experience.
-   **🎨 UI & Styling**:
    -   **Element Plus**: Integrated with the popular UI component library.
    -   **UnoCSS**: An on-demand, atomic CSS engine for rapid and efficient styling.
    -   **Iconify**: Access thousands of icons with `@nuxt/icon`, with Carbon Icons pre-configured.
-   **🗃️ State Management**:
    -   **Pinia**: The official, intuitive state management library for Vue.
    -   **Persistent State**: Keep user sessions alive with `pinia-plugin-persistedstate`.
-   **🌐 Internationalization (i18n)**:
    -   **@nuxtjs/i18n**: Full support for multiple languages.
    -   **Auto Language Detection**: Automatically redirects users based on their browser language.
-   **🔐 Advanced Permission Control**:
    -   **Route-level Guard**: Global middleware to protect routes based on user authentication.
    -   **Component-level Control**: A custom `v-permission` directive to finely control the visibility of elements based on user roles and permissions.
-   **🛠️ Developer Experience**:
    -   **ESLint**: Strict code linting with `@antfu/eslint-config`.
    -   **VueUse**: A comprehensive collection of utility composables.
    -   **Auto Imports**: Components, composables, and utilities are auto-imported.
    -   **Dotenv Support**: Manage multiple environments (`.env.dev`, `.env.production`) with ease.
-   **🔌 Pre-integrated Modules**:
    -   **Rich Text Editor**: `WangEditor` for content creation.
    -   **Image Cropper**: `vue-cropper` for image manipulation.
    -   **Drag & Drop**: `vue-draggable-next` for interactive lists.
-   **📦 Network & Upload**:
    -   **Request Hook**: A `useRequest` composable that wraps `$fetch` with a unified `BaseURL`, authentication headers, and error handling.
    -   **Image Upload**: A `useImageUpload` composable that simplifies file uploads and provides loading states.

---

## ⚙️ Permission Directive (`v-permission`)

Control element visibility with fine-grained logic.

-   **Usage**: `v-permission="[permissionId, userType, brandName]"`
-   **Examples**:
    -   `v-permission="[22, 1, 'some-brand']"`: Checks permission `22`, user type `1`, and brand name `'some-brand'`.
    -   `v-permission="[22, [1, 2]]"`: Checks permission `22` and if user type is `1` or `2`.
    -   `v-permission="[22, null, 'covos']"`: Skips user type check.
    -   `v-permission="[22]"`: Checks only for permission `22`.
    -   `v-permission:debug="[22]"`: Enables debug logging to the console for the directive.

---

## 🚀 Deployment

### Prerequisites

-   Node.js >= 22
-   pnpm
-   pm2

### Setup

1.  **Install NVM (Node Version Manager)**
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
    source ~/.bashrc
    ```

2.  **Install and use Node.js v22**
    ```bash
    nvm install 22
    nvm use 22
    ```

3.  **Install global dependencies**
    ```bash
    npm install -g pnpm pm2
    ```

4.  **Install project dependencies**
    ```bash
    pnpm install
    ```

### Running the Server

-   Start the development server:
    ```bash
    pnpm dev
    ```
