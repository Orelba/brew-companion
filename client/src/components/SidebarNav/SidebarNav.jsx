import { Drawer } from '@mantine/core'
import cx from 'classnames'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router'
import { LanguagePicker } from '../LanguagePicker/LanguagePicker'
import styles from './sidebar-nav.module.scss'

const SidebarNav = ({ opened, onClose, links }) => {
  const { i18n } = useTranslation()

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
        onClick={onClose}
        className={({ isActive }) =>
          cx(styles.link, { [styles.active]: isActive })
        }
      >
        {link.label}
      </NavLink>
    </motion.div>
  ))

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
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
      <LanguagePicker />
    </Drawer>
  )
}

export default SidebarNav
