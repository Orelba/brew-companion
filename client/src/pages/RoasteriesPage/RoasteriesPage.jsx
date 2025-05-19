import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, Button, SimpleGrid } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import RoasteryForm from '../../components/RoasteryForm/RoasteryForm'
import RoasteryCard from '../../components/RoasteryCard/RoasteryCard'
import InventoryContext from '../../contexts/InventoryContext'
import useDeleteRoastery from '../../hooks/mutations/useDeleteRoastery'
import useLoadingScreen from '../../hooks/useLoadingScreen'
import { usePageTitle } from '../../hooks/usePageTitle'

const RoasteriesPage = () => {
  const { roasteries, searchValue } = useContext(InventoryContext)

  // Manage the state of the roastery form modal
  const [
    isRoasteryFormOpened,
    { open: openRoasteryForm, close: closeRoasteryForm },
  ] = useDisclosure()

  // State to store the ID of the roastery being edited
  const [roasteryIdToUpdate, setRoasteryIdToUpdate] = useState(null)

  // Get the translations for the page
  const { t } = useTranslation()

  // Set the page title
  usePageTitle(t('pageTitles.roasteriesPage'))

  // Set the global loading state based on the use of placeholder data
  useLoadingScreen(roasteries.isPlaceholderData, t('loading.roasteries'))

  // Optimistic mutation for deleting roasteries
  const deleteMutation = useDeleteRoastery()

  const openDeleteConfirmationModal = (roasteryId) => {
    return modals.openConfirmModal({
      title: t('roasteriesPage.deleteModal.title'),
      children: (
        <>
          <Text size='sm' fw={600}>
            {t('roasteriesPage.deleteModal.message.title')}
          </Text>
          <Text size='sm' fw={300}>
            {t('roasteriesPage.deleteModal.message.description')}
          </Text>
        </>
      ),
      labels: {
        confirm: t('roasteriesPage.deleteModal.confirm'),
        cancel: t('roasteriesPage.deleteModal.cancel'),
      },
      onConfirm: () => deleteMutation.mutate(roasteryId),
    })
  }

  const items = (roasteries.data || [])
    .filter((roastery) =>
      roastery.name.toLowerCase().includes(searchValue.toLowerCase())
    )
    .map((roastery) => (
      <RoasteryCard
        key={roastery._id}
        data={roastery}
        onMenuEdit={() => {
          setRoasteryIdToUpdate(roastery._id)
          openRoasteryForm()
        }}
        onMenuDelete={() => openDeleteConfirmationModal(roastery._id)}
        menuDisabled={!!roastery?.optimistic}
      />
    ))

  return (
    <>
      <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }}>
        <Button mih={102} h='100%' variant='light' onClick={openRoasteryForm}>
          {t('roasteriesPage.addRoastery')}
        </Button>
        {items}
      </SimpleGrid>
      <RoasteryForm
        opened={isRoasteryFormOpened}
        closeFormModal={closeRoasteryForm}
        roasteryIdToUpdate={roasteryIdToUpdate}
        // Reset the roastery ID after closing to prevent form title from changing on exit transition
        onExited={() => setRoasteryIdToUpdate(null)}
      />
    </>
  )
}

export default RoasteriesPage
