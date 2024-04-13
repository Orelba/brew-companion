import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageTitle } from '../../hooks/usePageTitle'
import PageTransitionWrapper from '../../components/PageTransitionWrapper/PageTransitionWrapper'
import {
  Container,
  Group,
  Space,
  Select,
  Tooltip,
  ActionIcon,
  Accordion,
} from '@mantine/core'
import { IconRotate } from '@tabler/icons-react'
import AccordionItemWithMenu from '../../components/AccordionItemWithMenu/AccordionItemWithMenu'
import axios from 'axios'

const BrewsPage = () => {
  const [brews, setBrews] = useState([])
  const [coffeeSelectValue, setCoffeeSelectValue] = useState(null)
  const [methodSelectValue, setMethodSelectValue] = useState(null)

  const { t } = useTranslation()

  // Set the page title
  usePageTitle('Brews')

  // Filter brews based on selected coffee
  const filteredBrewsByCoffee = brews.filter((brew) => {
    return !coffeeSelectValue || brew.coffee._id === coffeeSelectValue
  })

  // Filter brews based on selected brewing method
  const filteredBrewsByMethod = brews.filter((brew) => {
    return !methodSelectValue || brew.method._id === methodSelectValue
  })

  // Get all brewing methods and remove duplicates based on selected coffee
  const brewingMethodsOptions = filteredBrewsByCoffee.reduce(
    (uniqueMethods, brew) => {
      const existingBrew = uniqueMethods.find(
        (item) => item.value === brew.method._id
      )

      if (!existingBrew) {
        uniqueMethods.push({ value: brew.method._id, label: t(brew.method.name) })
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

  // Fetch all brews
  useEffect(() => {
    const fetchBrews = async () => {
      try {
        const response = await axios.get('/api/brew')
        setBrews(response.data)
        console.log(response.data) // TODO: remove
      } catch (error) {
        console.error(error)
      }
    }

    fetchBrews()
  }, [])

  // Check if both select fields are empty
  const areSelectFieldsEmpty = !coffeeSelectValue && !methodSelectValue

  // Reset select fields
  const resetSelections = () => {
    setCoffeeSelectValue(null)
    setMethodSelectValue(null)
  }

  const items = brews.map((brew) => (
    <AccordionItemWithMenu key={brew._id} item={brew} variant='brew' />
  ))

  return (
    <PageTransitionWrapper>
      <Container
        size='100vw'
        m={{ base: 10, xs: 20, sm: 40, lg: 50, xl: 60 }}
        p={0}
      >
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
