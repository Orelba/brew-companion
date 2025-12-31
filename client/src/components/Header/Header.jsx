import {
  // components
  AppShellHeader,
  Burger,
  Group,
  Image,
  // hooks
  useComputedColorScheme,
  useDrawersStack,
} from '@mantine/core'
import cx from 'classnames'
import useAuth from '../../hooks/useAuth'
import useInventoryStatus from '../../hooks/useInventoryStatus'
import { useTranslation } from 'react-i18next'
import { NavLink, useNavigate, useLocation } from 'react-router'
import UserDropdownMenu from '../UserDropdownMenu/UserDropdownMenu'
import SidebarNav from '../SidebarNav/SidebarNav'
import styles from './header.module.scss'
import ColorSchemeSwitch from '../ColorSchemeSwitch/ColorSchemeSwitch'
import LanguageSwitch from '../LanguageSwitch/LanguageSwitch'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { auth } = useAuth()
  const { isInventoryComplete } = useInventoryStatus()

  // Control language and direction
  const { t } = useTranslation()

  const stack = useDrawersStack(['navigation', 'account'])

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
          {!!auth?.accessToken && (
            <>
              <Burger
                opened={stack.state.navigation}
                onClick={() => stack.toggle('navigation')}
                size='sm'
                hiddenFrom='sm'
              />
              <SidebarNav
                stack={stack}
                links={isInventoryComplete ? links : [links[0]]}
                handleNavClick={handleNavClick}
              />
            </>
          )}
          <Image
            src={logo}
            h={40}
            alt='Logo'
            onClick={() => navigate('/')}
            className={styles.logo}
          />
        </Group>

        <Group gap={5} visibleFrom='sm'>
          {!!auth?.accessToken && isInventoryComplete && items}
          {!!auth?.accessToken && <UserDropdownMenu />}
        </Group>
        {!auth?.accessToken ? (
          <Group gap={12}>
            <ColorSchemeSwitch />
            <LanguageSwitch />
          </Group>
        ) : (
          <ColorSchemeSwitch
            hiddenFrom={auth?.accessToken ? 'sm' : undefined}
          />
        )}
      </div>
    </AppShellHeader>
  )
}

export default Header
