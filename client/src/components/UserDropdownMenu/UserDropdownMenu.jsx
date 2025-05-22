import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import useLogout from '../../hooks/useLogout'
import { getCurrentUser } from '../../services/usersService'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { Avatar, Menu, Group, rem, UnstyledButton } from '@mantine/core'
import { IconLogout, IconSettings } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import cx from 'classnames'
import styles from './user-dropdown-menu.module.scss'

const UserDropdownMenu = () => {
  const navigate = useNavigate()

  const { t } = useTranslation()

  const [opened, setOpened] = useState(false)

  const logout = useLogout()

  const axiosPrivate = useAxiosPrivate()

  // TODO: Handle errors (maybe with notification of something went wrong)
  const { data, isLoading, isError } = useQuery({
    queryKey: ['me'],
    queryFn: () => getCurrentUser(axiosPrivate),
  })

  const handleOpen = () => {
    setOpened(true)
  }

  const handleClose = () => {
    setOpened(false)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: t('notifications.userInfoFetchError'),
        color: 'red',
      })
    }
  }, [isError, t])

  if (isLoading) {
    return null
  }

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
        <Menu.Label component='div' c='var(--mantine-color-text)'>
          <div className={styles.username}>{data.username} </div>
          <div className={styles.email}>{data.email}</div>
        </Menu.Label>
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
