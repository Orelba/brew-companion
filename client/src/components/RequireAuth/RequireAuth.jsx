import { useLocation, Navigate } from 'react-router'
import useAuth from '../../hooks/useAuth'

const RequireAuth = ({ children }) => {
  const { auth } = useAuth()
  const location = useLocation()

  return auth?.accessToken ? (
    children
  ) : (
    <Navigate to='/auth' state={{ from: location }} replace />
  )
}

export default RequireAuth
