import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
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
import { fetchRecentBrews } from '../../services/brewsService'
import ButtonCard from '../ButtonCard/ButtonCard'
import LoaderLogo from '../LoaderLogo/LoaderLogo'
import BrewForm from '../BrewForm/BrewForm'

const QuickBrewCarousel = () => {
  const theme = useMantineTheme()
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)

  const { t } = useTranslation()

  const [opened, { open, close }] = useDisclosure()

  const [initialValues, setInitialValues] = useState()

  const {
    data: recentBrews,
    error,
    isPlaceholderData,
  } = useQuery({
    queryKey: ['latestBrews'],
    queryFn: fetchRecentBrews,
    placeholderData: [], // Default data to an empty array
  })

  if (error) return null

  const setInitialValuesAndOpenForm = (brew) => {
    setInitialValues(brew)
    open()
  }

  const getInitialValues = () => initialValues

  const slides = recentBrews.map((brew) => (
    <Carousel.Slide
      key={brew._id}
      onClick={() => setInitialValuesAndOpenForm(brew)}
    >
      <ButtonCard
        key={brew._id}
        title={t(brew.brewingMethod.name)}
        image={brew.brewingMethod.image}
        text={brew.coffee.name}
      />
    </Carousel.Slide>
  ))

  // FIXME: CHECK AND FIX THE PROBLEM WITH THE SCROLL IN THE WRONG DIRECTION AFTER REFRESH (MAYBE THERE IS SOME WAY TO PASS THE DIR TO EMBLA ON EVERY RENDER)
  return (
    <>
      <Stack gap='md' h='100%' m={{ base: 10, xs: 20, sm: 40, lg: 50, xl: 60 }}>
        <Title order={1} style={{ alignSelf: 'flex-start' }}>
          {t('quickBrewCarousel.title')}
        </Title>
        <Carousel
          slideSize={{
            base: '85%', // Not 100% so the user knows there are more slides
            xs: '43%',
            sm: '33.333333%',
            md: '25%',
            lg: '20%',
          }}
          slideGap={{ base: 'xs', sm: 'sm', md: 'md' }}
          align='start'
          slidesToScroll={mobile ? 1 : 3}
          containScroll='trimSnaps'
          withControls={false}
        >
          {slides}
          {/* Skeleton is used to give the overlay height */}
          <Skeleton h={rem(200)} visible={isPlaceholderData || error} />
          <LoadingOverlay
            visible={isPlaceholderData || error}
            loaderProps={{
              children: error ? (
                <h4>Could not get recent brews</h4>
              ) : (
                <LoaderLogo />
              ),
            }}
            overlayProps={{ radius: 'sm', blur: 2 }}
          />
        </Carousel>
      </Stack>
      <BrewForm
        opened={opened}
        onClose={close}
        getInitialValues={getInitialValues}
      />
    </>
  )
}

export default QuickBrewCarousel
