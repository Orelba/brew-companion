import axios from 'axios'
import { t } from 'i18next'
import { notifications } from '@mantine/notifications'

const axiosInstance = axios.create({
  // baseURL: '/api',
})

export const axiosPrivate = axios.create({
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// Handle rate limiting errors (HTTP 429)
const handleRateLimitError = (error) => {
  if (error?.response?.status === 429) {
    // Show user notification
    notifications.show({
      title: t('notifications.tooManyRequestsError') || 'Too many requests',
      message:
        t('notifications.tryAgainLater') ||
        'Please slow down and try again in a bit.',
      color: 'yellow',
    })
  }

  return Promise.reject(error)
}

// Add response interceptor to default instance
axiosInstance.interceptors.response.use(
  (response) => response,
  handleRateLimitError
)

// Add response interceptor to private instance
axiosPrivate.interceptors.response.use(
  (response) => response,
  handleRateLimitError
)

export default axiosInstance
