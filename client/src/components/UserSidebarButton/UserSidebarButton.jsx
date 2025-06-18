import { useTranslation } from 'react-i18next'
import useUserInfo from '../../hooks/useUserInfo'
import { Avatar, Group, Text, UnstyledButton } from '@mantine/core'
import { IconChevronRight, IconChevronLeft } from '@tabler/icons-react'
import styles from './user-sidebar-button.module.scss'

const UserSidebarButton = ({ onClick }) => {
  const { i18n } = useTranslation()
  const direction = i18n.dir()

  const { data, isLoading } = useUserInfo()

  if (isLoading || !data) return null

  return (
    <UnstyledButton p='md' className={styles.user} onClick={onClick}>
      <Group>
        <Avatar name={data.username} radius='xl' color='initials' />

        <div style={{ flex: 1 }}>
          <Text size='sm' fw={500}>
            {data.username}
          </Text>

          <Text c='dimmed' size='xs'>
            {data.email}
          </Text>
        </div>

        {direction === 'ltr' ? (
          <IconChevronRight size={14} stroke={1.5} />
        ) : (
          <IconChevronLeft size={14} stroke={1.5} />
        )}
      </Group>
    </UnstyledButton>
  )
}

export default UserSidebarButton
