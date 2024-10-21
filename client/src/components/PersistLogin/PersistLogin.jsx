import { useState, useEffect } from 'react'
import useRefreshToken from '../../hooks/useRefreshToken'
import useAuth from '../../hooks/useAuth'

// Ensure that the user's session is maintained by refreshing the token if necessary
const PersistLogin = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const refresh = useRefreshToken()
  const { auth, persist } = useAuth()

  useEffect(() => {
    let isMounted = true

    const verifyRefreshToken = async () => {
      try {
        await refresh() // Attempt to refresh the access token
      } catch (error) {
        console.error(error) // Log any errors during the refresh process
      } finally {
        isMounted && setIsLoading(false) // Stop loading once token is verified or refresh attempt completes
      }
    }

    // Verify or refresh token if none exists
    !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false)

    return () => {
      isMounted = false
    }
  }, [refresh, auth?.accessToken, persist])

  return !persist ? children : isLoading ? null : children
}

export default PersistLogin
