import { Navigate } from 'react-router'
import useInventoryStatus from '../../hooks/useInventoryStatus'

const RequireOnboarding = ({ children }) => {
  const { isInventoryReady, isInventoryComplete } = useInventoryStatus()

  if (!isInventoryReady) {
    return null
  }

  return isInventoryComplete ? children : <Navigate to='/' replace />
}

export default RequireOnboarding
