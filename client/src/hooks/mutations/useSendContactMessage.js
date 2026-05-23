import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { notifications } from '@mantine/notifications'
import { sendContactMessage } from '../../services/contactService'

const useSendContactMessage = (axiosInstance) => {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (formData) => sendContactMessage(formData, axiosInstance),
    onSuccess: () => {
      notifications.show({
        title: t('contactPage.successNotification'),
        color: 'green',
      })
    },
    onError: () => {
      notifications.show({
        title: t('contactPage.errorNotification'),
        color: 'red',
      })
    },
  })
}

export default useSendContactMessage
