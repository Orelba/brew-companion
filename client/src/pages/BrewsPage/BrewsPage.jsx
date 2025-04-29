import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import { fetchBrews } from '../../services/brewsService'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import {
  Accordion,
  ActionIcon,
  Button,
  Container,
  Group,
  Select,
  Space,
  Tooltip,
  useMantineTheme,
} from '@mantine/core'
import { IconRotate } from '@tabler/icons-react'
import AccordionItemWithMenu from '../../components/AccordionItemWithMenu/AccordionItemWithMenu'
import BrewForm from '../../components/BrewForm/BrewForm'
import useLoadingScreen from '../../hooks/useLoadingScreen'
import PageTransitionWrapper from '../../components/PageTransitionWrapper/PageTransitionWrapper'
import styles from './brews-page.module.scss'

const BrewsPage = () => {
  const [coffeeSelectValue, setCoffeeSelectValue] = useState(null)
  const [methodSelectValue, setMethodSelectValue] = useState(null)

  // Get the translations for the page
  const { t } = useTranslation()

  // Check if the screen size is tablet or smaller
  const theme = useMantineTheme()
  const isTablet = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)

  // Set the page title
  usePageTitle(t('pageTitles.brewsPage'))

  // Manage the state of the brew form modal
  const [isBrewFormOpened, { open: openBrewForm, close: closeBrewForm }] =
    useDisclosure()

  const axiosPrivate = useAxiosPrivate()

  // Fetch all brews if it exists, otherwise default to an empty array
  const {
    data: brews,
    error,
    isPlaceholderData,
  } = useQuery({
    queryKey: ['brews'],
    queryFn: () => fetchBrews(axiosPrivate),
    placeholderData: [], // Default data to an empty array
  })

  // Set the global loading state based on the use of placeholder data
  useLoadingScreen(isPlaceholderData, t('loading.brews'))

  if (error) return <div>An error occurred: {error.message}</div>

  // Filter the brews to exclude brews that use archived coffees
  const nonArchivedBrews = brews.filter((brew) => !brew.coffee.archived)

  // Filter brews based on selected coffee
  const filteredBrewsByCoffee = nonArchivedBrews.filter(
    (brew) => !coffeeSelectValue || brew.coffee._id === coffeeSelectValue
  )

  // Filter brews based on selected brewing method
  const filteredBrewsByMethod = nonArchivedBrews.filter(
    (brew) => !methodSelectValue || brew.brewingMethod._id === methodSelectValue
  )

  // Get all brewing methods and remove duplicates based on selected coffee
  const brewingMethodsOptions = filteredBrewsByCoffee.reduce(
    (uniqueMethods, brew) => {
      const existingBrew = uniqueMethods.find(
        (item) => item.value === brew.brewingMethod._id
      )

      if (!existingBrew) {
        uniqueMethods.push({
          value: brew.brewingMethod._id,
          label: t(brew.brewingMethod.name),
        })
      }

      return uniqueMethods
    },
    []
  )

  // Get all coffee options and remove duplicates based on selected brewing method
  const coffeeOptions = filteredBrewsByMethod.reduce((uniqueCoffees, brew) => {
    const existingCoffee = uniqueCoffees.find(
      (item) => item.value === brew.coffee._id
    )

    if (!existingCoffee) {
      uniqueCoffees.push({ value: brew.coffee._id, label: brew.coffee.name })
    }

    return uniqueCoffees
  }, [])

  // Check if both select fields are empty for the reset button
  const areSelectFieldsEmpty = !coffeeSelectValue && !methodSelectValue

  // Reset select fields
  const resetSelections = () => {
    setCoffeeSelectValue(null)
    setMethodSelectValue(null)
  }

  const items = nonArchivedBrews
    .filter((brew) => {
      // If a coffee is selected, only include brews that use the selected coffee
      if (coffeeSelectValue && brew.coffee._id !== coffeeSelectValue)
        return false

      // If a method is selected, only include brews that use the selected method
      if (methodSelectValue && brew.brewingMethod._id !== methodSelectValue)
        return false

      // If neither coffee nor method is selected, or if the brew matches both selections, include the brew
      return true
    })
    .map((brew) => <AccordionItemWithMenu key={brew._id} item={brew} />)

  return (
    <PageTransitionWrapper>
      <Container
        m={{ base: 10, xs: 20, sm: 40, lg: 50, xl: 60 }}
        p={0}
        className={styles.container}
        fluid
      >
        <Group justify='space-between' wrap='nowrap'>
          <Group wrap='nowrap'>
            <Select
              placeholder={t('brewsPage.allCoffees')}
              data={coffeeOptions}
              value={coffeeSelectValue}
              onChange={setCoffeeSelectValue}
              searchable
              nothingFoundMessage={t('brewsPage.noCoffeesFound')}
            />
            <Select
              placeholder={t('brewsPage.allMethods')}
              data={brewingMethodsOptions}
              value={methodSelectValue}
              onChange={setMethodSelectValue}
            />
            <Tooltip
              label={t('brewsPage.resetFilters')}
              transitionProps={{ transition: 'pop' }}
              withArrow
              disabled={areSelectFieldsEmpty}
              openDelay={500}
            >
              <ActionIcon
                size='36'
                variant='default'
                onClick={resetSelections}
                disabled={areSelectFieldsEmpty}
              >
                <IconRotate stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          </Group>
          {!isTablet && (
            <Button variant='light' onClick={openBrewForm}>
              {t('brewsPage.addBrew')}
            </Button>
          )}
          <BrewForm opened={isBrewFormOpened} onClose={closeBrewForm} />
        </Group>
        <Space h={{ base: 'md', sm: 'lg' }} />
        {isTablet && (
          <Button
            w='100%'
            h={52}
            mb='md'
            variant='light'
            styles={{ root: { borderRadius: 0 } }}
            onClick={openBrewForm}
          >
            {t('brewsPage.addBrew')}
          </Button>
        )}
        <Accordion chevronPosition='left'>{items}</Accordion>
      </Container>
    </PageTransitionWrapper>
  )
}

export default BrewsPage
