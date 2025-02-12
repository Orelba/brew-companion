import { Button, Container, Overlay, Text, Title } from '@mantine/core'
import '@mantine/core/styles.css'
import { useDisclosure } from '@mantine/hooks'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router'
import AuthForm from '../../components/AuthForm/AuthForm'
import PageTransitionWrapper from '../../components/PageTransitionWrapper/PageTransitionWrapper'
import QuickBrewCarousel from '../../components/QuickBrewCarousel/QuickBrewCarousel'
import { usePageTitle } from '../../hooks/usePageTitle'
import styles from './home-page.module.scss'

const HomePage = () => {
  // Get the translations for the page
  const { t } = useTranslation()

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
      <div className={styles.hero}>
        <Overlay
          gradient='linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)'
          opacity={1}
          zIndex={0}
        />
        <Container className={styles.container} size='md'>
          <Title
            className={styles.title}
            c='var(--mantine-color-white)'
            fw={900}
          >
            {t('homePage.heroTitle')}
          </Title>
          <Text
            className={styles.description}
            size='xl'
            mt='xl'
            c='var(--mantine-color-white)'
            fw={100}
          >
            {t('homePage.heroDescription')}
          </Text>

          {/* Auth form button and modal*/}
          <Button
            variant='gradient'
            gradient={{
              from: 'var(--mantine-color-brown-8)',
              to: 'var(--mantine-color-brown-4)',
            }}
            size='xl'
            radius='xl'
            className={styles.control}
            onClick={openAuthFormModal}
          >
            {t('homePage.heroButtonText')}
          </Button>
          <AuthForm
            opened={isAuthFormModalOpened}
            onClose={closeAuthFormModal}
          />
        </Container>
      </div>
      {/* TODO: Uncomment */}
      {/* <QuickBrewCarousel /> */}
    </PageTransitionWrapper>
  )
}

export default HomePage
