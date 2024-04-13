import { usePageTitle } from '../../hooks/usePageTitle'
import { useTranslation } from 'react-i18next'
import PageTransitionWrapper from '../../components/PageTransitionWrapper/PageTransitionWrapper'
import {
  Stack,
  SimpleGrid,
  Title,
  Overlay,
  Container,
  Button,
  Text,
} from '@mantine/core'
import CardButton from '../../components/CardButton/CardButton'
import QuickBrewCarousel from '../../components/QuickBrewCarousel/QuickBrewCarousel'
import '@mantine/core/styles.css'
import '@mantine/carousel/styles.css'
import styles from './home-page.module.scss'

const HomePage = () => {
  // Set the page title
  usePageTitle('')

  const { t } = useTranslation()

  const brewingMethods = [
    { image: '/espresso.jpg', title: t('brewingMethods.espresso') },
    { image: '/pour-over.jpg', title: t('brewingMethods.pourOver') },
    { image: '/moka-pot.jpg', title: t('brewingMethods.mokaPot') },
    { image: '/aeropress.jpg', title: t('brewingMethods.aeroPress') },
    { image: '/french-press.jpg', title: t('brewingMethods.frenchPress') },
    { image: '/turkish-cezve.jpg', title: t('brewingMethods.turkishCoffee') },
  ]

  const cards = brewingMethods.map((method, idx) => (
    <CardButton key={idx} title={method.title} image={method.image} />
  ))

  return (
    <PageTransitionWrapper>
      <div className={styles.hero}>
        <Overlay
          gradient='linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)'
          opacity={1}
          zIndex={0}
        />
        <Container className={styles.container} size='md'>
          <Title className={styles.title}>{t('homePage.heroTitle')}</Title>
          <Text className={styles.description} size='xl' mt='xl'>
            {t('homePage.heroDescription')}
          </Text>

          <Button
            variant='gradient'
            gradient={{
              from: 'var(--mantine-color-brown-8)',
              to: 'var(--mantine-color-brown-4)',
            }}
            size='xl'
            radius='xl'
            className={styles.control}
          >
            {t('homePage.heroButtonText')}
          </Button>
        </Container>
      </div>

      <QuickBrewCarousel />

      {/* <Stack gap='md' justify='flex-start' align='center' m={50}>
        <Stack gap='md' justify='flex-start' align='center'>
          <Title order={2} style={{ alignSelf: 'flex-start' }}>
            What are we brewing today?
          </Title>

          <SimpleGrid cols={{ base: 2, xs: 3 }}>{cards}</SimpleGrid>
        </Stack>
      </Stack> */}
    </PageTransitionWrapper>
  )
}

export default HomePage
