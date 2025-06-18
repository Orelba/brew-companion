import { useTranslation } from 'react-i18next'
import {
  Menu,
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  rem,
} from '@mantine/core'
import { IconSun, IconMoon } from '@tabler/icons-react'
import styles from './color-scheme-switch.module.scss'
import cx from 'classnames'

const ColorSchemeSwitch = ({ variant, hiddenFrom }) => {
  const { t } = useTranslation()
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme()
  const isDark = computedColorScheme === 'dark'

  if (variant === 'menu-item')
    return (
      <Menu.Item
        onClick={() => setColorScheme(isDark ? 'light' : 'dark')}
        leftSection={
          <>
            <IconSun
              style={{ width: rem(16), height: rem(16) }}
              className={styles.light}
              stroke={1.5}
            />

            <IconMoon
              style={{ width: rem(16), height: rem(16) }}
              className={styles.dark}
              stroke={1.5}
            />
          </>
        }
      >
        {isDark
          ? t('ColorSchemeSwitch.lightMode')
          : t('ColorSchemeSwitch.darkMode')}
      </Menu.Item>
    )

  return (
    <ActionIcon
      onClick={() => setColorScheme(isDark ? 'light' : 'dark')}
      variant='default'
      aria-label='Toggle color scheme'
      radius='xl'
      hiddenFrom={hiddenFrom}
    >
      <IconSun className={cx(styles.icon, styles.light)} stroke={1.5} />
      <IconMoon className={cx(styles.icon, styles.dark)} stroke={1.5} />
    </ActionIcon>
  )
}

export default ColorSchemeSwitch
