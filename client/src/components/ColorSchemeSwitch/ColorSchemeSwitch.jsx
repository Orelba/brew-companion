import {
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
} from '@mantine/core'
import { IconSun, IconMoon } from '@tabler/icons-react'
import styles from './color-scheme-switch.module.scss'
import cx from 'classnames'

const ColorSchemeSwitch = () => {
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme()

  return (
    <ActionIcon
      onClick={() =>
        setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark')
      }
      variant='default'
      aria-label='Toggle color scheme'
      radius='xl'
    >
      <IconSun className={cx(styles.icon, styles.light)} stroke={1.5} />
      <IconMoon className={cx(styles.icon, styles.dark)} stroke={1.5} />
    </ActionIcon>
  )
}

export default ColorSchemeSwitch
