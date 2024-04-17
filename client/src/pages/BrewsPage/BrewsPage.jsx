import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageTitle } from '../../hooks/usePageTitle'
import PageTransitionWrapper from '../../components/PageTransitionWrapper/PageTransitionWrapper'
import {
  LoadingOverlay,
  Container,
  Group,
  Space,
  Select,
  Tooltip,
  ActionIcon,
  Accordion,
} from '@mantine/core'
import LoaderLogo from '../../components/LoaderLogo/LoaderLogo'
import { IconRotate } from '@tabler/icons-react'
import AccordionItemWithMenu from '../../components/AccordionItemWithMenu/AccordionItemWithMenu'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const BrewsPage = () => {
  const [coffeeSelectValue, setCoffeeSelectValue] = useState(null)
  const [methodSelectValue, setMethodSelectValue] = useState(null)

  const { t } = useTranslation()

  // Set the page title
  usePageTitle('Brews')

  // Fetch all brews if it exists, otherwise default to an empty array
  const {
    data: brews = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ['brews'],
    queryFn: () => axios.get('/api/brew').then((res) => res.data),
    refetchOnWindowFocus: false, // Disable automatic refetch on window focus
  })

  if (error) return <div>An error occurred: {error.message}</div>

  // Filter brews based on selected coffee
  const filteredBrewsByCoffee = brews.filter(
    (brew) => !coffeeSelectValue || brew.coffee._id === coffeeSelectValue
  )

  // Filter brews based on selected brewing method
  const filteredBrewsByMethod = brews.filter(
    (brew) => !methodSelectValue || brew.method._id === methodSelectValue
  )

  // Get all brewing methods and remove duplicates based on selected coffee
  const brewingMethodsOptions = filteredBrewsByCoffee.reduce(
    (uniqueMethods, brew) => {
      const existingBrew = uniqueMethods.find(
        (item) => item.value === brew.method._id
      )

      if (!existingBrew) {
        uniqueMethods.push({
          value: brew.method._id,
          label: t(brew.method.name),
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

  const items = brews
    .filter((brew) => {
      // If a coffee is selected, only include brews that use the selected coffee
      if (coffeeSelectValue && brew.coffee._id !== coffeeSelectValue)
        return false

      // If a method is selected, only include brews that use the selected method
      if (methodSelectValue && brew.method._id !== methodSelectValue)
        return false

      // If neither coffee nor method is selected, or if the brew matches both selections, include the brew
      return true
    })
    .map((brew) => (
      <AccordionItemWithMenu key={brew._id} item={brew} variant='brew' />
    ))

  return (
    <PageTransitionWrapper>
      <Container
        m={{ base: 10, xs: 20, sm: 40, lg: 50, xl: 60 }}
        p={0}
        pos='relative' // FIXME: why when I use this I cant make the container take 100% height
        fluid
      >
        <LoadingOverlay
          visible={isLoading}
          loaderProps={{ children: <LoaderLogo /> }}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
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
              <IconRotate
                style={{ width: '70%', height: '70%' }}
                stroke={1.5}
              />
            </ActionIcon>
          </Tooltip>
        </Group>
        <Space h='lg' />
        <Accordion chevronPosition='left'>{items}</Accordion>
      </Container>
    </PageTransitionWrapper>
  )
}

export default BrewsPage
