import { Link } from 'react-router-dom'
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

const NotFoundPage = () => {
  // Set the page title
  usePageTitle('Not Found')

  const NotFoundImageSrc = '/not-found-404.svg'

  return (
    <PageTransitionWrapper>
      <Container className={styles.root}>
        <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
          <Image src={NotFoundImageSrc} className={styles.mobileImage} />
          <div>
            <Title className={styles.title}>
              Something&apos;s brewing, but not quite right..
            </Title>
            <Text c='dimmed' size='lg'>
              The page you are trying to open does not exist. You may have
              mistyped the address, or the page has been moved to another URL.
            </Text>
            <Button
              component={Link}
              to='/'
              variant='outline'
              size='md'
              mt='xl'
              className={styles.control}
              color={'var(--mantine-color-brown-outline)'}
            >
              Get back to home page
            </Button>
          </div>
          <Image src={NotFoundImageSrc} className={styles.desktopImage} />
        </SimpleGrid>
      </Container>
    </PageTransitionWrapper>
  )
}

export default NotFoundPage
