import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enTranslation from './en.json'
import heTranslation from './he.json'

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    // debug: import.meta.env.MODE === 'development', // Set debug to true only in development
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already handles escaping
    },
    resources: {
      en: {
        translation: enTranslation,
      },
      he: {
        translation: heTranslation,
      },
    },
  })

export default i18next
