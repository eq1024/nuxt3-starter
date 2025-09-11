import en from '@/locales/en.json'
import { currentLocaleCodes } from './i18n'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  availableLocales: currentLocaleCodes,
  fallbackLocale: 'en', // 区配不到的语言就用en
  messages: {
    en,
  },
}))
