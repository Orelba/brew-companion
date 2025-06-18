import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { getCurrentUser } from '../services/usersService'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { notifications } from '@mantine/notifications'

const useUserInfo = () => {
  const axiosPrivate = useAxiosPrivate()
  const { t } = useTranslation()

  return useQuery({
    queryKey: ['me'],
    queryFn: () => getCurrentUser(axiosPrivate),
    onError: () => {
      notifications.show({
        title: t('notifications.userInfoFetchError'),
        color: 'red',
      })
    },
  })
}

export default useUserInfo
