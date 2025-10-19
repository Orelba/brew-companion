import useLanguageSwitcher from '../../hooks/useLanguageSwitcher'
import { ActionIcon } from '@mantine/core'
import { IconAlphabetHebrew, IconAlphabetLatin } from '@tabler/icons-react'

const LanguageSwitch = () => {
  const { selected, changeLanguage } = useLanguageSwitcher()
  const title = selected.code === 'en' ? 'Switch to Hebrew' : 'החלף שפה לאנגלית'

  return (
    <ActionIcon
      onClick={() => changeLanguage(selected.code === 'he' ? 'en' : 'he')}
      variant='default'
      aria-label={title}
      radius='xl'
      title={title}
    >
      {selected.code === 'en' ? (
        <IconAlphabetHebrew stroke={1.5} />
      ) : (
        <IconAlphabetLatin stroke={1.5} />
      )}
    </ActionIcon>
  )
}

export default LanguageSwitch
