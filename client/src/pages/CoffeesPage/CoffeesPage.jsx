import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, Button, SimpleGrid } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import CoffeeForm from '../../components/CoffeeForm/CoffeeForm'
import CoffeeCard from '../../components/CoffeeCard/CoffeeCard'
import InventoryContext from '../../contexts/InventoryContext'
import useDeleteCoffee from '../../hooks/mutations/useDeleteCoffee'
import useToggleArchiveCoffee from '../../hooks/mutations/useToggleArchiveCoffee'
import useLoadingScreen from '../../hooks/useLoadingScreen'
import { usePageTitle } from '../../hooks/usePageTitle'

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

  // Set the global loading state based on the use of placeholder data
  useLoadingScreen(coffees.isPlaceholderData, t('loading.coffees'))

  // Optimistic mutations for archiving and deleting coffees
  const toggleArchiveMutation = useToggleArchiveCoffee()
  const deleteMutation = useDeleteCoffee()

  const openDeleteConfirmationModal = (coffeeId) => {
    return modals.openConfirmModal({
      title: t('coffeesPage.deleteModal.title'),
      children: (
        <>
          <Text size='sm' fw={600}>
            {t('coffeesPage.deleteModal.message.title')}
          </Text>
          <Text size='sm' fw={300}>
            {t('coffeesPage.deleteModal.message.description')}
          </Text>
        </>
      ),
      labels: {
        confirm: t('coffeesPage.deleteModal.confirm'),
        cancel: t('coffeesPage.deleteModal.cancel'),
      },
      onConfirm: () => deleteMutation.mutate(coffeeId),
    })
  }

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
          toggleArchiveMutation.mutate({
            coffeeId: coffee._id,
            isArchived: !coffee.archived,
          })
        }
        onMenuDelete={() => openDeleteConfirmationModal(coffee._id)}
        menuDisabled={!!coffee?.optimistic}
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
