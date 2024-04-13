import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  // hooks
  useMantineColorScheme,
  // components
  AppShellHeader,
  Group,
  Burger,
  Image,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { LanguagePicker } from '../LanguagePicker/LanguagePicker'
import styles from './header.module.scss'
import cx from 'classnames'

const Header = () => {
  const navigate = useNavigate()

  // Control language and direction
  const { t } = useTranslation()

  // Control the burger menu
  const [opened, { toggle }] = useDisclosure(false)

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
        </Group>
        <Group>
          <Group ml={50} gap={5} visibleFrom='sm'>
            {items}
            <LanguagePicker />
          </Group>
        </Group>
      </div>
    </AppShellHeader>
  )
}

export default Header
