import {
  // components
  AppShellHeader,
  Burger,
  Group,
  Image,
  // hooks
  useComputedColorScheme,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import cx from 'classnames'
import useAuth from '../../hooks/useAuth'
import { useTranslation } from 'react-i18next'
import { NavLink, useNavigate, useLocation } from 'react-router'
import { LanguagePicker } from '../LanguagePicker/LanguagePicker'
import UserDropdownMenu from '../UserDropdownMenu/UserDropdownMenu'
import SidebarNav from '../SidebarNav/SidebarNav'
import styles from './header.module.scss'
import ColorSchemeSwitch from '../ColorSchemeSwitch/ColorSchemeSwitch'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { auth } = useAuth()

  // Control language and direction
  const { t } = useTranslation()

  // Control the sidebar navigation menu
  const [opened, { close, toggle }] = useDisclosure(false)

  const computedColorScheme = useComputedColorScheme()

  // Change logo based on color scheme
  const logo =
    computedColorScheme === 'dark'
      ? '/brew-companion-logo-light.svg'
      : '/brew-companion-logo-dark.svg'

  const links = [
    { link: '/', label: t('header.home') },
    { link: 'brews', label: t('header.brews') },
    { link: 'inventory', label: t('header.inventory') },
  ]

  const handleNavClick = (e, linkPath) => {
    const currentPath = location.pathname
    const targetPath = linkPath.startsWith('/') ? linkPath : `/${linkPath}`

    // For home page, check exact match
    if (targetPath === '/') {
      if (currentPath === '/') {
        e.preventDefault()
        return true // Navigation was prevented
      }
    } else {
      // For other pages, check if current path starts with target path
      // This handles nested routes like /inventory/coffees matching /inventory
      if (currentPath.startsWith(targetPath)) {
        e.preventDefault()
        return true // Navigation was prevented
      }
    }
    return false // Navigation will proceed
  }

  const items = links.map((link) => (
    <NavLink
      key={link.label}
      to={link.link}
      onClick={(e) => handleNavClick(e, link.link)}
      className={({ isActive }) =>
        cx(styles.link, { [styles.active]: isActive })
      }
    >
      {link.label}
    </NavLink>
  ))

  return (
    <AppShellHeader className={styles.header}>
      <div className={styles.inner}>
        <Group wrap='nowrap'>
          <Burger opened={opened} onClick={toggle} size='sm' hiddenFrom='sm' />
          <Image
            src={logo}
            h={40}
            alt='Logo'
            onClick={() => navigate('/')}
            className={styles.logo}
          />
          <SidebarNav
            opened={opened}
            onClose={close}
            links={links}
            handleNavClick={handleNavClick}
          />
        </Group>
        <Group>
          <Group gap={5} visibleFrom='sm'>
            {items}
            <LanguagePicker />
            <ColorSchemeSwitch />
            {!!auth?.accessToken && <UserDropdownMenu />}
          </Group>
        </Group>
      </div>
    </AppShellHeader>
  )
}

export default Header
