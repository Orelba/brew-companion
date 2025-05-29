import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useDisclosure } from '@mantine/hooks'
import { usePageTitle } from '../../hooks/usePageTitle'
import PageTransitionWrapper from '../../components/PageTransitionWrapper/PageTransitionWrapper'
import HeroSection from '../../components/HeroSection/HeroSection'
import FeatureCardsSection from '../../components/FeatureCardsSection/FeatureCardsSection'
import AuthForm from '../../components/AuthForm/AuthForm'

const HomePage = () => {
  // Set the page title
  usePageTitle('')

  // Handle navigation and track the current URL for modal management
  const navigate = useNavigate()
  const location = useLocation()

  // Manage the state of the AuthForm modal
  const [isAuthFormModalOpened, { open, close }] = useDisclosure()

  const openAuthFormModal = () => {
    navigate('/auth')
  }

  const closeAuthFormModal = () => {
    close()
    navigate('/')
  }

  useEffect(() => {
    if (location.pathname === '/auth') {
      open()
    }
  }, [location.pathname, open])

  return (
    <PageTransitionWrapper>
      <HeroSection onClickButton={openAuthFormModal} />
      <FeatureCardsSection />
      <AuthForm opened={isAuthFormModalOpened} onClose={closeAuthFormModal} />
    </PageTransitionWrapper>
  )
}

export default HomePage
