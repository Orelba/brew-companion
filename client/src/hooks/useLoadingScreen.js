import { useContext, useEffect } from 'react'
import LoadingScreenContext from '../contexts/LoadingScreenContext'

const useLoadingScreen = (shouldLoad, text = '') => {
  // Access the loading context
  const loadingScreenContext = useContext(LoadingScreenContext)

  // Ensure the hook is used within a LoadingScreenProvider
  if (!loadingScreenContext) {
    throw new Error('useLoading must be used within a LoadingScreenProvider')
  }

  const { setIsLoading, setLoadingText } = loadingScreenContext

  useEffect(() => {
    // If shouldLoad is undefined, do nothing (in case that no args were passed)
    if (shouldLoad === undefined) return

    // Set loading state based on shouldLoad
    setIsLoading(shouldLoad)

    // Set or clear loading text based on shouldLoad
    setLoadingText(shouldLoad ? text : '')

    // Cleanup function to reset state when dependencies change or component unmounts
    return () => {
      setIsLoading(false)
      setLoadingText('')
    }
  }, [shouldLoad, text, setIsLoading, setLoadingText])

  // Return the loading context for potential further use
  return loadingScreenContext
}

export default useLoadingScreen
