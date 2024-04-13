import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { dir as i18nDir } from 'i18next'
import {
  // hooks
  useDirection,
  // components
  Group,
  Image,
  Menu,
  UnstyledButton,
} from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import styles from './language-picker.module.scss'

const data = [
  { label: 'English', image: '/uk.png', code: 'en' },
  { label: 'עברית', image: '/israel.png', code: 'he' },
]

export function LanguagePicker() {
  const { setDirection } = useDirection()
  const { i18n } = useTranslation()
  const [opened, setOpened] = useState(false)
  const [selected, setSelected] = useState(
    data.find((item) => item.code === i18n.language) || data[0]
  )

  const chooseLanguage = (item) => {
    i18n.changeLanguage(item.code)
    setDirection(i18nDir())
    setSelected(item)
  }

  const items = data.map((item) => (
    <Menu.Item
      leftSection={<Image src={item.image} width={18} height={18} />}
      onClick={() => chooseLanguage(item)}
      key={item.code}
    >
      {item.label}
    </Menu.Item>
  ))

  return (
    <Menu
      onOpen={() => setOpened(true)}
      onClose={() => setOpened(false)}
      radius='md'
      width='target'
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton
          className={styles.control}
          data-expanded={opened || undefined}
        >
          <Group gap='xs'>
            <Image src={selected.image} width={22} height={22} />
            <span className={styles.label}>{selected.label}</span>
          </Group>
          <IconChevronDown size='1rem' className={styles.icon} stroke={1.5} />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
  )
}
