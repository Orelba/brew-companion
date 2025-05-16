import { useState } from 'react'
import useToggleArchiveCoffee from '../../hooks/mutations/useToggleArchiveCoffee'
import useDeleteCoffee from '../../hooks/mutations/useDeleteCoffee'
import { useContext } from 'react'
import { useDisclosure } from '@mantine/hooks'
import CoffeeForm from '../../components/CoffeeForm/CoffeeForm'
import { usePageTitle } from '../../hooks/usePageTitle'
import InventoryContext from '../../contexts/InventoryContext'
import { Button, SimpleGrid } from '@mantine/core'
import CoffeeCard from '../../components/CoffeeCard/CoffeeCard'
import { useTranslation } from 'react-i18next'
import useLoadingScreen from '../../hooks/useLoadingScreen'

const CoffeesPage = () => {
  const { coffees, roasteries, searchValue, isArchive } =
    useContext(InventoryContext)

  // Manage the state of the coffee form modal
  const [isCoffeeFormOpened, { open: openCoffeeForm, close: closeCoffeeForm }] =
    useDisclosure()

  // State to store the ID of the coffee being edited
  const [coffeeIdToUpdate, setCoffeeIdToUpdate] = useState(null)

  // Get the translations for the page
  const { t } = useTranslation()

  // Set the page title
  usePageTitle(t('pageTitles.coffeesPage'))

  const { isPlaceholderData } = coffees

  // Set the global loading state based on the use of placeholder data
  useLoadingScreen(isPlaceholderData, t('loading.coffees'))

  // Optimistic mutations for archiving and deleting coffees
  const toggleArchiveMutation = useToggleArchiveCoffee()
  const deleteMutation = useDeleteCoffee()

  const items = (coffees.data || [])
    .filter(
      (coffee) =>
        // Match search query and archive state
        coffee.name.toLowerCase().includes(searchValue.toLowerCase()) &&
        coffee.archived === isArchive
    )
    .map((coffee) => (
      <CoffeeCard
        key={coffee._id}
        data={coffee}
        onMenuEdit={() => {
          setCoffeeIdToUpdate(coffee._id)
          openCoffeeForm()
        }}
        onMenuArchive={() =>
          toggleArchiveMutation.mutate({ coffee, isArchived: !coffee.archived })
        }
        onMenuDelete={() => deleteMutation.mutate(coffee)}
      />
    ))

  return (
    <>
      <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }}>
        {!isArchive && (
          <Button mih={102} h='100%' variant='light' onClick={openCoffeeForm}>
            {t('coffeesPage.addCoffee')}
          </Button>
        )}
        {items}
      </SimpleGrid>
      <CoffeeForm
        opened={isCoffeeFormOpened}
        closeFormModal={closeCoffeeForm}
        coffeeIdToUpdate={coffeeIdToUpdate}
        roasteries={roasteries}
        // Reset the coffee ID after closing to prevent form title from changing on exit transition
        onExited={() => setCoffeeIdToUpdate(null)}
      />
    </>
  )
}

export default CoffeesPage
