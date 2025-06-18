import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { dir as i18nDir } from 'i18next'
import { useDirection } from '@mantine/core'

const languages = [
  { label: 'English', image: '/uk.png', code: 'en' },
  { label: 'עברית', image: '/israel.png', code: 'he' },
]

const useLanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const { setDirection } = useDirection()

  const [selected, setSelected] = useState(
    () => languages.find((lang) => lang.code === i18n.language) || languages[0]
  )

  useEffect(() => {
    setSelected(
      languages.find((lang) => lang.code === i18n.language) || languages[0]
    )
  }, [i18n.language])

  const changeLanguage = (langCode) => {
    const language = languages.find((l) => l.code === langCode)
    if (!language || langCode === selected.code) return

    i18n.changeLanguage(langCode)
    setDirection(i18nDir())
    setSelected(language)
  }

  return {
    languages,
    selected,
    changeLanguage,
  }
}

export default useLanguageSwitcher
