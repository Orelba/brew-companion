import { useContext } from 'react'
import { usePageTitle } from '../../hooks/usePageTitle'
import InventoryContext from '../../contexts/InventoryContext'
import { Accordion } from '@mantine/core'
import AccordionItemWithMenu from '../../components/AccordionItemWithMenu/AccordionItemWithMenu'
import { useTranslation } from 'react-i18next'

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
    .map((item) => (
      <AccordionItemWithMenu key={item._id} item={item} variant='roastery' />
    ))

  return <Accordion chevronPosition='left'>{items}</Accordion>
}

export default RoasteriesPage
