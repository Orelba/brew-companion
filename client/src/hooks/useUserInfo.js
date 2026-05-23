import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { getCurrentUser } from '../services/usersService'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useAuth from '../hooks/useAuth'
import { notifications } from '@mantine/notifications'

const useUserInfo = () => {
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuth()
  const { t } = useTranslation()

  return useQuery({
    queryKey: ['me'],
    queryFn: () => getCurrentUser(axiosPrivate),
    enabled: !!auth?.accessToken, // Only fetch if authenticated
    onError: () => {
      notifications.show({
        title: t('notifications.userInfoFetchError'),
        color: 'red',
      })
    },
  })
}

export default useUserInfo
