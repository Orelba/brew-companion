import { useContext } from 'react'
import { usePageTitle } from '../../hooks/usePageTitle'
import { InventoryContext } from '../../contexts/InventoryContext'

import { SimpleGrid } from '@mantine/core'
import CoffeeCard from '../../components/CoffeeCard/CoffeeCard'

const CoffeesPage = () => {
  const { coffees, searchValue } = useContext(InventoryContext)

  // Set the page title
  usePageTitle('Coffees')

  const items = coffees
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
