import { useState, useEffect } from 'react'
import {
  // components
  AppShellHeader,
  Burger,
  Button,
  Group,
  Image,
  // hooks
  useMantineColorScheme,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import cx from 'classnames'
import useAuth from '../../hooks/useAuth'
import useLogout from '../../hooks/useLogout'
import { useTranslation } from 'react-i18next'
import { NavLink, useNavigate } from 'react-router-dom'
import { LanguagePicker } from '../LanguagePicker/LanguagePicker'
import SidebarNav from '../SidebarNav/SidebarNav'
import styles from './header.module.scss'

const Header = () => {
  const navigate = useNavigate()

  const { auth } = useAuth()
  const logout = useLogout()

  // Control language and direction
  const { t } = useTranslation()

  // Control the sidebar navigation menu
  const [opened, { close, toggle }] = useDisclosure(false)

  const { colorScheme } = useMantineColorScheme()

  // Change logo based on color scheme
  const logo =
    colorScheme === 'dark'
      ? '/brew-companion-logo-light.svg'
      : '/brew-companion-logo-dark.svg'

  const links = [
    { link: '/', label: t('header.home') },
    { link: 'brews', label: t('header.brews') },
    { link: 'inventory', label: t('header.inventory') },
  ]

  const items = links.map((link) => (
    <NavLink
      key={link.label}
      to={link.link}
      className={({ isActive }) =>
        cx(styles.link, { [styles.active]: isActive })
      }
    >
      {link.label}
    </NavLink>
  ))

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <AppShellHeader className={styles.header}>
      <div className={styles.inner}>
        <Group>
          <Burger opened={opened} onClick={toggle} size='sm' hiddenFrom='sm' />
          <Image
            src={logo}
            h={40}
            alt='Logo'
            onClick={() => navigate('/')}
            className={styles.logo}
          />
          <SidebarNav opened={opened} onClose={close} links={links} />
        </Group>
        <Group>
          <Group gap={5} visibleFrom='sm'>
            {items}
            <LanguagePicker />
            {!!auth?.accessToken && (
              <Button onClick={handleLogout}>Log out</Button>
            )}
          </Group>
        </Group>
      </div>
    </AppShellHeader>
  )
}

export default Header
