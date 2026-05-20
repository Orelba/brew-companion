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
        if (!auth?.accessToken && persist) {
          await refresh() // Attempt to refresh the access token
        }
      } catch (error) {
        console.error(error) // Log any errors during the refresh process
      } finally {
        if (isMounted) setIsLoading(false) // Stop loading once verification completes
      }
    }

    verifyRefreshToken()

    return () => {
      isMounted = false
    }
  }, [refresh, auth?.accessToken, persist])

  if (!persist || !isLoading) return children
  return null
}

export default PersistLogin
