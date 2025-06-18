import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import useUserInfo from '../../hooks/useUserInfo'
import useLogout from '../../hooks/useLogout'
import { Avatar, Menu, Group, UnstyledButton, Image, rem } from '@mantine/core'
import {
  IconLogout,
  IconSettings,
  IconWorld,
  IconCheck,
} from '@tabler/icons-react'
import ColorSchemeSwitch from '../ColorSchemeSwitch/ColorSchemeSwitch'
import useLanguageSwitcher from '../../hooks/useLanguageSwitcher'
import cx from 'classnames'
import styles from './user-dropdown-menu.module.scss'

const UserDropdownMenu = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  // Menu state
  const [opened, setOpened] = useState(false)

  // User info and logout
  const { data, isLoading } = useUserInfo()
  const logout = useLogout()

  // Language switching
  const { languages, selected, changeLanguage } = useLanguageSwitcher()

  if (isLoading || !data) return null

  const handleOpen = () => setOpened(true)
  const handleClose = () => setOpened(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const languageMenuItems = languages.map((lang) => (
    <Menu.Item
      key={lang.code}
      onClick={() => changeLanguage(lang.code)}
      leftSection={<Image src={lang.image} width={16} height={16} />}
      rightSection={
        selected.code === lang.code && (
          <IconCheck style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
        )
      }
      style={
        selected.code === lang.code
          ? { pointerEvents: 'none', cursor: 'default' }
          : undefined
      }
    >
      {lang.label}
    </Menu.Item>
  ))

  return (
    <Menu onOpen={handleOpen} onClose={handleClose} withinPortal>
      <Menu.Target>
        <UnstyledButton
          className={cx(styles.user, {
            [styles.active]: opened,
          })}
        >
          <Group gap={7}>
            <Avatar name={data.username} size='2.1rem' color='initials' />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label dir='ltr' component='div' c='var(--mantine-color-text)'>
          <div className={styles.username}>{data.username}</div>
          <div className={styles.email}>{data.email}</div>
        </Menu.Label>
        <Menu.Divider />
        <Menu.Label>{t('userDropdownMenu.preferencesLabel')}</Menu.Label>
        <ColorSchemeSwitch variant='menu-item' />
        <Menu.Sub>
          <Menu.Sub.Target>
            <Menu.Sub.Item
              leftSection={
                <IconWorld
                  style={{ width: rem(16), height: rem(16) }}
                  stroke={1.5}
                />
              }
            >
              {t('userDropdownMenu.language')}
            </Menu.Sub.Item>
          </Menu.Sub.Target>
          <Menu.Sub.Dropdown>{languageMenuItems}</Menu.Sub.Dropdown>
        </Menu.Sub>
        <Menu.Divider />
        <Menu.Item
          leftSection={
            <IconSettings
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
        >
          {t('userDropdownMenu.accountSettings')}
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          onClick={handleLogout}
          color='red'
          leftSection={
            <IconLogout
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
        >
          {t('userDropdownMenu.logout')}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}

export default UserDropdownMenu
