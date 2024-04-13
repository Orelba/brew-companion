import { useTranslation } from 'react-i18next'
import { Carousel } from '@mantine/carousel'
import { useMediaQuery } from '@mantine/hooks'
import { Stack, Paper, Text, Title, useMantineTheme, rem } from '@mantine/core'
import styles from './quick-brew-carousel.module.scss'

const QuickBrewCarousel = () => {
  const theme = useMantineTheme()
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)

  const { t } = useTranslation()

  // TODO: replace with actual data
  const recentBrews = [
    {
      image: '/espresso.jpg',
      title: t('brewingMethods.espresso'),
      coffee: 'Ethiopian Chocolate',
    },
    {
      image: '/pour-over.jpg',
      title: t('brewingMethods.pourOver'),
      coffee: 'Ethiopia Yirgacheffe Kochere Anaerobic',
    },
    {
      image: '/moka-pot.jpg',
      title: t('brewingMethods.mokaPot'),
      coffee: 'Cuba Serrano Lavado',
    },
    {
      image: '/aeropress.jpg',
      title: t('brewingMethods.aeroPress'),
      coffee: 'Indonesia Java Frinsa Manis',
    },
    {
      image: '/turkish-cezve.jpg',
      title: t('brewingMethods.turkishCoffee'),
      coffee: 'Indonesia Sumatra Orangutan',
    },
  ]

  const slides = recentBrews.map((brew, idx) => (
    <Carousel.Slide key={idx}>
      <Card
        key={idx}
        title={brew.title}
        image={brew.image}
        text={brew.coffee}
        className={styles['carousel-card']}
      />
    </Carousel.Slide>
  ))

  return (
    <Stack gap='md' h='100%' m={{ base: 10, xs: 20, sm: 40, lg: 50, xl: 60 }}>
      <Title order={1} style={{ alignSelf: 'flex-start' }}>
        {t('quickBrewCarousel.title')}
      </Title>
      <Carousel
        slideSize={{
          base: '100%',
          xs: '50%',
          sm: '33.333333%',
          md: '25%',
          lg: '20%',
        }}
        slideGap={{ base: rem(2), sm: 'md' }}
        align='start'
        slidesToScroll={mobile ? 1 : 3}
        containScroll='trimSnaps'
      >
        {slides}
      </Carousel>
    </Stack>
  )
}

const Card = ({ image, title, text }) => {
  return (
    <div className={styles.container}>
      <Paper
        shadow='md'
        p='lg'
        radius='md'
        style={{ backgroundImage: `url(${image})` }}
        className={styles.card}
      >
        <div>
          <Title order={3} className={styles.title}>
            {title}
          </Title>
          <Text mt='xs' size='xl' lineClamp={2}>
            {text}
          </Text>
        </div>
      </Paper>
    </div>
  )
}

export default QuickBrewCarousel
