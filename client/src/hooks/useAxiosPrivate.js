import { useEffect } from 'react'
import { axiosPrivate } from '../services/axiosInstance'
import useRefreshToken from './useRefreshToken'
import useAuth from './useAuth'

// Custom hook for configuring Axios with interceptors
const useAxiosPrivate = () => {
  const refresh = useRefreshToken()
  const { auth } = useAuth()

  useEffect(() => {
    // Request interceptor to add the access token to headers
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        // If there's no Authorization header, add the current access token
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${auth?.accessToken}`
        }
        return config
      },
      // Forward request errors
      (error) => Promise.reject(error)
    )

    // Response interceptor to handle token expiration
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response, // Forward successful responses
      async (error) => {
        const prevRequest = error?.config // Access the original request configuration
        // Attempt to refresh token if 401 error occurs
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true // Mark request as having been resent
          const newAccessToken = await refresh() // Refresh access token
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}` // Attach new token
          return axiosPrivate(prevRequest) // Retry the request with updated token
        }
        return Promise.reject(error) // Forward other errors
      }
    )

    // Cleanup to remove interceptors on component unmount
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept)
      axiosPrivate.interceptors.response.eject(responseIntercept)
    }
  }, [auth, refresh])

  return axiosPrivate
}

export default useAxiosPrivate
