import { Link } from 'react-router'
import { usePageTitle } from '../../hooks/usePageTitle'
import PageTransitionWrapper from '../../components/PageTransitionWrapper/PageTransitionWrapper'
import {
  Image,
  Container,
  Title,
  Text,
  Button,
  SimpleGrid,
} from '@mantine/core'
import styles from './not-found-page.module.scss'
import { useTranslation } from 'react-i18next'

const NotFoundPage = () => {
  // Get the translations for the page
  const { t } = useTranslation()

  // Set the page title
  usePageTitle(t('pageTitles.notFoundPage'))

  const NotFoundImageSrc = '/not-found-404.svg'

  return (
    <PageTransitionWrapper>
      <Container className={styles.root}>
        <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
          <Image src={NotFoundImageSrc} className={styles.mobileImage} />
          <div>
            <Title className={styles.title}>{t('notFoundPage.title')}</Title>
            <Text c='dimmed' size='lg'>
              {t('notFoundPage.description')}
            </Text>
            <Button
              component={Link}
              to='/'
              variant='outline'
              size='md'
              mt='xl'
              className={styles.control}
              color='var(--mantine-color-brown-outline)'
            >
              {t('notFoundPage.goHomeButton')}
            </Button>
          </div>
          <Image src={NotFoundImageSrc} className={styles.desktopImage} />
        </SimpleGrid>
      </Container>
    </PageTransitionWrapper>
  )
}

export default NotFoundPage
