import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { dir as i18nDir } from 'i18next'
import { useDirection } from '@mantine/core'

const languages = [
  { label: 'English', image: '/uk.png', code: 'en' },
  { label: 'עברית', image: '/israel.png', code: 'he' },
]

const normalizeLangCode = (code) => {
  // Normalize Hebrew language code to match the one in the languages array
  return code.startsWith('he') ? 'he' : code
}

const getLanguageFromCode = (code) => {
  return (
    languages.find((lang) => lang.code === normalizeLangCode(code)) ||
    languages[0]
  )
}

const useLanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const { setDirection } = useDirection()

  const [selected, setSelected] = useState(() =>
    getLanguageFromCode(i18n.language)
  )

  useEffect(() => {
    setSelected(getLanguageFromCode(i18n.language))
    setDirection(i18nDir(i18n.language))
  }, [i18n.language, setDirection])

  const changeLanguage = (langCode) => {
    const language = languages.find((lang) => lang.code === langCode)
    if (!language) return
    if (langCode === selected.code) return

    i18n.changeLanguage(langCode)
    setDirection(i18nDir(langCode))
  }

  return {
    languages,
    selected,
    changeLanguage,
  }
}

export default useLanguageSwitcher
