import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import useLanguageSwitcher from '../../hooks/useLanguageSwitcher'
import useLogout from '../../hooks/useLogout'
import { Drawer, Stack, Button, Divider, rem } from '@mantine/core'
import { IconLogout, IconSettings, IconWorld } from '@tabler/icons-react'

const UserSidebarMenu = ({ stack }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { selected, changeLanguage } = useLanguageSwitcher()

  const logout = useLogout()

  const handleLogout = async () => {
    await logout()
    navigate('/')
    stack.closeAll()
  }

  return (
    <Drawer
      {...stack.register('account')}
      position='bottom'
      styles={{
        content: {
          display: 'flex',
          flexDirection: 'column',
          height: 'fit-content',
          maxHeight: '40vh',
        },
        body: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexGrow: 1,
        },
      }}
    >
      <Stack gap={12} mb={16}>
        <Button
          justify='flex-start'
          leftSection={
            <IconSettings
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
          variant='light'
        >
          {t('userDropdownMenu.accountSettings')}
        </Button>

        <Button
          justify='flex-start'
          onClick={() => changeLanguage(selected.code === 'en' ? 'he' : 'en')}
          leftSection={
            <IconWorld
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
          variant='light'
        >
          {t('userDropdownMenu.switchLanguage')}
        </Button>

        <Divider variant='dotted' />

        <Button
          justify='flex-start'
          onClick={handleLogout}
          leftSection={
            <IconLogout
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
          color='red'
          variant='light'
        >
          {t('userDropdownMenu.logout')}
        </Button>
      </Stack>
    </Drawer>
  )
}

export default UserSidebarMenu
