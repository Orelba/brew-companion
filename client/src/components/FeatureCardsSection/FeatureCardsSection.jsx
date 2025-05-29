import { useTranslation } from 'react-i18next'
import { IconListDetails, IconCoffee, IconTimeline } from '@tabler/icons-react'
import {
  Image,
  Card,
  Container,
  Group,
  SimpleGrid,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import LoaderLogo from '../LoaderLogo/LoaderLogo'
import styles from './feature-cards-section.module.scss'

const FeatureCardsSection = () => {
  const { i18n, t } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'

  const theme = useMantineTheme()
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`)

  const data = [
    {
      title: t('featureCards.trackBrews.title'),
      description: t('featureCards.trackBrews.description'),
      icon: IconCoffee,
    },
    {
      title: t('featureCards.visualizeStats.title'),
      description: t('featureCards.visualizeStats.description'),
      icon: IconTimeline,
    },
    {
      title: t('featureCards.centralizedData.title'),
      description: t('featureCards.centralizedData.description'),
      icon: IconListDetails,
    },
  ]

  const features = data.map((feature) => (
    <Card
      key={feature.title}
      shadow='md'
      radius='md'
      className={styles.card}
      padding='xl'
    >
      <feature.icon
        size={isMobile ? 40 : 50}
        stroke={1.5}
        color={theme.colors.brown[6]}
        className={styles.icon}
        style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }}
      />
      <Text fz='lg' fw={500} className={styles.cardTitle} mt='md'>
        {feature.title}
      </Text>
      <Text fz='sm' c='dimmed' mt='sm'>
        {feature.description}
      </Text>
    </Card>
  ))

  return (
    <Container size='lg' py='xl'>
      <Group justify='center'>
        <LoaderLogo withAnimation={false} scale={0.7} />
      </Group>

      <Title order={2} className={styles.title} ta='center' mt='sm'>
        {t('featureCards.sectionTitle')}
      </Title>

      <Text
        c='dimmed'
        fz={{ base: 'md', sm: 'lg', md: 'xl' }}
        className={styles.description}
        ta='center'
        mt='md'
      >
        {t('featureCards.sectionDescription')}
      </Text>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing='xl' mt={50}>
        {features}
      </SimpleGrid>
    </Container>
  )
}

export default FeatureCardsSection
