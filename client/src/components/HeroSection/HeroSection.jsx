import { useTranslation } from 'react-i18next'
import {
  Button,
  Container,
  Overlay,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { motion } from 'motion/react'
import '@mantine/core/styles.css'
import styles from './hero-section.module.scss'

const MotionText = motion.create(Text)

const HeroSection = ({ onClickButton }) => {
  const { t } = useTranslation()

  const theme = useMantineTheme()
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`)

  return (
    <div className={styles.hero}>
      <Overlay
        gradient='linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)'
        opacity={1}
        zIndex={0}
      />
      <Container className={styles.container} size='md'>
        <Title className={styles.title} c='var(--mantine-color-white)' fw={900}>
          {t('homePage.heroTitle')}
        </Title>
        <Text
          className={styles.description}
          fz={{ base: 'md', sm: 'lg', md: 'xl' }}
          mt='xl'
          c='var(--mantine-color-white)'
          fw={100}
        >
          {t('homePage.heroDescription')}
        </Text>

        {/* Click to action button*/}
        <div>
          <Button
            variant='gradient'
            gradient={{
              from: 'var(--mantine-color-brown-8)',
              to: 'var(--mantine-color-brown-4)',
            }}
            size={isMobile ? 'lg' : 'xl'}
            radius='xl'
            className={styles.control}
            onClick={onClickButton}
          >
            {t('homePage.heroButtonText')}
          </Button>
          <MotionText
            fz={{ base: 'xs', xs: 'sm' }}
            mt='sm'
            c='dimmed'
            ta='center'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
          >
            {t('homePage.heroButtonSubtext')}
          </MotionText>
        </div>
      </Container>
    </div>
  )
}

export default HeroSection
