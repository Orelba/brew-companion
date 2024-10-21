import useAuth from './useAuth'
import { refreshAccessToken } from '../services/AuthService'

const useRefreshToken = () => {
  const { setAuth } = useAuth()

  const refresh = async () => {
    try {
      const data = await refreshAccessToken()
      setAuth((prevState) => {
        return { ...prevState, accessToken: data.accessToken }
      })
      return data.accessToken
    } catch (error) {
      console.error('Error refreshing token:', error.message)
    }
  }

  return refresh
}

export default useRefreshToken
