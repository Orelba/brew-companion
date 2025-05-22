import useAuth from './useAuth'
import { refreshAccessToken } from '../services/authService'

const useRefreshToken = () => {
  const { setAuth } = useAuth()
  let refreshPromise = null // Store the refresh request promise

  const refresh = async () => {
    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          const data = await refreshAccessToken()
          setAuth((prevState) => ({
            ...prevState,
            accessToken: data.accessToken,
          }))
          return data.accessToken
        } catch (error) {
          console.error('Error refreshing token:', error.message)
          throw error
        } finally {
          refreshPromise = null // Reset after completion
        }
      })()
    }
    return refreshPromise // Return the ongoing request
  }

  return refresh
}

export default useRefreshToken
