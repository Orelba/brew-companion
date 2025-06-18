import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import useAuth from '../../hooks/useAuth'
import { NavLink } from 'react-router'
import { motion } from 'motion/react'
import { Drawer, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import UserSidebarButton from '../UserSidebarButton/UserSidebarButton'
import UserSidebarMenu from '../UserSidebarMenu/UserSidebarMenu'
import styles from './sidebar-nav.module.scss'
import cx from 'classnames'

const SidebarNav = ({ stack, links, handleNavClick }) => {
  const { i18n } = useTranslation()
  const { auth } = useAuth()

  const theme = useMantineTheme()
  const isTablet = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)

  useEffect(() => {
    if (!isTablet) stack.closeAll()
  }, [isTablet, stack])

  // 200ms (0.2s) is the time that takes for the drawer to open (So that the animation starts right after)
  const drawerTransitionDelay = 0.2
  const animationDuration = 0.16

  const items = links.map((link, i) => (
    <motion.div
      key={link.label}
      initial={{ opacity: 0, translateX: i18n.dir() === 'ltr' ? -10 : 10 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{
        duration: animationDuration,
        delay: drawerTransitionDelay + i * animationDuration,
      }}
    >
      <NavLink
        to={link.link}
        onClick={(e) => {
          const shouldNavigate = !handleNavClick(e, link.link)
          if (shouldNavigate) {
            stack.closeAll()
          }
        }}
        className={({ isActive }) =>
          cx(styles.link, { [styles.active]: isActive })
        }
      >
        {link.label}
      </NavLink>
    </motion.div>
  ))

  const handleAccountClick = () => {
    stack.close('navigation') // close sidebar drawer (burger goes to hamburger)
    stack.open('account') // then open account drawer
  }

  return (
    <Drawer.Stack>
      <Drawer
        {...stack.register('navigation')}
        styles={{
          content: { display: 'flex', flexDirection: 'column' },
          body: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flexGrow: 1,
          },
        }}
      >
        <div>{items}</div>

        {!!auth?.accessToken && (
          <UserSidebarButton onClick={handleAccountClick} />
        )}
      </Drawer>

      <UserSidebarMenu stack={stack} />
    </Drawer.Stack>
  )
}

export default SidebarNav
