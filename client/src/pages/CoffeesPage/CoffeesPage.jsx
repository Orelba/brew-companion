import { useContext } from 'react'
import { usePageTitle } from '../../hooks/usePageTitle'
import { InventoryContext } from '../../contexts/InventoryContext'
import { SimpleGrid } from '@mantine/core'
import CoffeeCard from '../../components/CoffeeCard/CoffeeCard'
import { useTranslation } from 'react-i18next'
import useLoadingScreen from '../../hooks/useLoadingScreen'

const CoffeesPage = () => {
  const { coffees, searchValue } = useContext(InventoryContext)

  // Get the translations for the page
  const { t } = useTranslation()

  // Set the page title
  usePageTitle(t('pageTitles.coffeesPage'))

  const { isPlaceholderData } = coffees

  // Set the global loading state based on the use of placeholder data
  useLoadingScreen(isPlaceholderData, t('loading.coffees'))

  const items = (coffees.data || [])
    .filter((coffee) =>
      coffee.name.toLowerCase().includes(searchValue.toLowerCase())
    )
    .map((coffee) => <CoffeeCard key={coffee._id} data={coffee} />)

  return (
    <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }}>
      {items}
    </SimpleGrid>
  )
}

export default CoffeesPage
