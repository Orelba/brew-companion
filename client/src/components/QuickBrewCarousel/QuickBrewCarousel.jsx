import { useState, useEffect } from 'react'
import { notifications } from '@mantine/notifications'
import { Carousel } from '@mantine/carousel'
import {
  Skeleton,
  LoadingOverlay,
  Stack,
  Title,
  useMantineTheme,
  rem,
} from '@mantine/core'
import { useMediaQuery, useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import ButtonCard from '../ButtonCard/ButtonCard'
import LoaderLogo from '../LoaderLogo/LoaderLogo'
import BrewForm from '../BrewForm/BrewForm'
import styles from './quick-brew-carousel.module.scss'

const QuickBrewCarousel = ({ data = [], isLoading, isError }) => {
  const theme = useMantineTheme()
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`)
  const isTablet = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)

  const { t } = useTranslation()

  const [opened, { open, close }] = useDisclosure()

  const [initialValues, setInitialValues] = useState()

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: t('notifications.quickBrewCarouselFetchError'),
        color: 'red',
      })
    }
  }, [isError, t])

  if (isError) return null

  const setInitialValuesAndOpenForm = (brew) => {
    setInitialValues(brew)
    open()
  }

  const slides = data.map((brew) => (
    <Carousel.Slide
      key={brew._id}
      onClick={() => setInitialValuesAndOpenForm(brew)}
    >
      <ButtonCard
        title={t(brew.brewingMethod.name)}
        image={brew.brewingMethod.image}
        text={brew.coffee.name}
      />
    </Carousel.Slide>
  ))

  return (
    <>
      <Stack gap='md' h='100%' m={{ base: 10, xs: 20, sm: 40, lg: 50, xl: 60 }}>
        <Title
          order={1}
          fz={{ base: 26, xs: 34 }}
          style={{ alignSelf: 'flex-start' }}
        >
          {t('quickBrewCarousel.title')}
        </Title>
        <Carousel
          height={isMobile ? rem(120) : rem(200)}
          slideSize={{
            base: '85%', // Not 100% so the user knows there are more slides
            xs: '43%',
            sm: '33.333333%',
            md: '25%',
            lg: '20%',
          }}
          slideGap={{ base: 'xs', sm: 'sm', md: 'md' }}
          emblaOptions={{
            align: 'start',
            slidesToScroll: 'auto',
            containScroll: 'trimSnaps',
            dragFree: isMobile,
          }}
          classNames={styles}
          withControls={!isTablet}
          controlsOffset='xs'
        >
          {slides}
          {/* Skeleton is used to give the overlay height */}
          <Skeleton h={rem(200)} visible={isLoading} />
          <LoadingOverlay
            visible={isLoading}
            loaderProps={{
              children: <LoaderLogo />,
            }}
            overlayProps={{ radius: 'sm', blur: 2 }}
          />
        </Carousel>
      </Stack>
      <BrewForm
        opened={opened}
        onClose={close}
        getInitialValues={() => initialValues}
      />
    </>
  )
}

export default QuickBrewCarousel
