import { createContext, useState } from 'react'

const LoadingScreenContext = createContext()

export const LoadingScreenProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('')

  return (
    <LoadingScreenContext.Provider
      value={{ isLoading, setIsLoading, loadingText, setLoadingText }}
    >
      {children}
    </LoadingScreenContext.Provider>
  )
}

export default LoadingScreenContext
