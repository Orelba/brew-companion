import { useContext } from 'react'
import { usePageTitle } from '../../hooks/usePageTitle'
import InventoryContext from '../../contexts/InventoryContext'
import { Button, SimpleGrid } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import RoasteryCard from '../../components/RoasteryCard/RoasteryCard'

const RoasteriesPage = () => {
  const { roasteries, searchValue } = useContext(InventoryContext)

  // Get the translations for the page
  const { t } = useTranslation()

  // Set the page title
  usePageTitle(t('pageTitles.roasteriesPage'))

  const items = (roasteries.data || [])
    .filter((roastery) =>
      roastery.name.toLowerCase().includes(searchValue.toLowerCase())
    )
    .map((roastery) => (
      <RoasteryCard key={roastery._id} data={roastery} variant='roastery' />
    ))

  return (
    <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }}>
      <Button mih={102} h='100%' variant='light' onClick={null}>
        {t('roasteriesPage.addRoastery')}
      </Button>

      {items}
    </SimpleGrid>
  )
}

export default RoasteriesPage
