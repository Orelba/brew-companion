import useAuth from '../../hooks/useAuth'
import HomePage from '../HomePage/HomePage'
import DashboardPage from '../DashboardPage/DashboardPage'

const ProtectedHomePage = () => {
  const { auth } = useAuth()

  return auth?.accessToken ? <DashboardPage /> : <HomePage />
}

export default ProtectedHomePage
