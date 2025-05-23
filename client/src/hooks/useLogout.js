import useAuth from './useAuth'
import { logout as logoutService } from '../services/authService'
import { useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'

const useLogout = () => {
  const { setAuth } = useAuth()

  const queryClient = useQueryClient()

  const { t } = useTranslation()

  const logout = async () => {
    try {
      await logoutService()
      setAuth({}) // Clear auth state
      queryClient.clear() // Clear the query cache
      notifications.show({
        title: t('notifications.logoutSuccessful'),
        color: 'green',
      })
    } catch (error) {
      notifications.show({
        title: t('notifications.logoutFailed'),
        color: 'red',
      })
    }
  }

  return logout
}

export default useLogout
