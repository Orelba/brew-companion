import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import { fetchBrews } from '../../services/brewsService'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import {
  Accordion,
  Text,
  ActionIcon,
  Button,
  Container,
  Group,
  Select,
  Space,
  Tooltip,
  Menu,
  Switch,
  useMantineTheme,
} from '@mantine/core'
import BrewRatioFilter from '../../components/BrewRatioFilter/BrewRatioFilter'
import { IconAdjustmentsHorizontal, IconRotate } from '@tabler/icons-react'
import AccordionItemWithMenu from '../../components/AccordionItemWithMenu/AccordionItemWithMenu'
import BrewForm from '../../components/BrewForm/BrewForm'
import useLoadingScreen from '../../hooks/useLoadingScreen'
import PageTransitionWrapper from '../../components/PageTransitionWrapper/PageTransitionWrapper'
import styles from './brews-page.module.scss'

const BrewsPage = () => {
  const [coffeeSelectValue, setCoffeeSelectValue] = useState(null)
  const [methodSelectValue, setMethodSelectValue] = useState(null)
  const [showOnlyNonArchived, setShowOnlyNonArchived] = useState(true)
  const [ratioRange, setRatioRange] = useState(null)

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

  // Filter the brews to exclude or include brews that use archived coffees
  const activeBrews = showOnlyNonArchived
    ? brews.filter((brew) => !brew.coffee.archived)
    : brews

  // Filter brews based on selected coffee
  const filteredBrewsByCoffee = activeBrews.filter(
    (brew) => !coffeeSelectValue || brew.coffee._id === coffeeSelectValue
  )

  // Filter brews based on selected brewing method
  const filteredBrewsByMethod = activeBrews.filter(
    (brew) => !methodSelectValue || brew.brewingMethod._id === methodSelectValue
  )

  // Combined filter for items + ratio slider
  const filteredBrews = activeBrews.filter((brew) => {
    if (coffeeSelectValue && brew.coffee._id !== coffeeSelectValue) return false
    if (methodSelectValue && brew.brewingMethod._id !== methodSelectValue)
      return false
    return true
  })

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
  const areSelectFieldsEmpty =
    !coffeeSelectValue && !methodSelectValue && !ratioRange

  // Reset select fields
  const resetSelections = () => {
    setCoffeeSelectValue(null)
    setMethodSelectValue(null)
    setRatioRange(null)
  }

  const items = filteredBrews
    .filter((brew) => {
      if (!ratioRange || !brew.dose || !brew.yield) return true
      const ratio = brew.yield / brew.dose
      return ratio >= ratioRange[0] && ratio <= ratioRange[1]
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
              onChange={(value) => {
                setCoffeeSelectValue(value)
                setRatioRange(null)
              }}
              searchable
              nothingFoundMessage={t('brewsPage.noCoffeesFound')}
            />
            <Select
              placeholder={t('brewsPage.allMethods')}
              data={brewingMethodsOptions}
              value={methodSelectValue}
              onChange={(value) => {
                setMethodSelectValue(value)
                setRatioRange(null)
              }}
            />
            <Menu>
              <Menu.Target>
                <ActionIcon
                  size='36'
                  variant='default'
                  onClick={(event) => event.stopPropagation()}
                >
                  <IconAdjustmentsHorizontal stroke={1.5} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown onClick={(event) => event.stopPropagation()}>
                <Menu.Label>{t('brewsPage.advancedOptions')}</Menu.Label>
                {/* TODO: Show Archived Toggle, Dose RangeSlider, USE TRANSLATION */}
                <BrewRatioFilter
                  key={filteredBrews.length} // Reset the internal state of the component when the range of ratios changes
                  brews={filteredBrews}
                  value={ratioRange}
                  onChange={setRatioRange}
                />
                {/* FIXME: This works but is super slow */}
                {/* <Switch
                  label='Show Archived'
                  checked={!showOnlyNonArchived}
                  onChange={(event) =>
                    setShowOnlyNonArchived(!event.currentTarget.checked)
                  }
                /> */}
              </Menu.Dropdown>
            </Menu>
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
        <Accordion chevronPosition='left'>
          {' '}
          {items.length > 0 ? (
            items
          ) : (
            <Text c='dimmed' ta='center' py='xl'>
              {t('brewsPage.noBrewsFound')}
            </Text>
          )}
        </Accordion>
      </Container>
    </PageTransitionWrapper>
  )
}

export default BrewsPage
