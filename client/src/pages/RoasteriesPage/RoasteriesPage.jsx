import { useContext } from 'react'
import { usePageTitle } from '../../hooks/usePageTitle'
import { InventoryContext } from '../../contexts/InventoryContext'
import { Accordion } from '@mantine/core'
import AccordionItemWithMenu from '../../components/AccordionItemWithMenu/AccordionItemWithMenu'

const RoasteriesPage = () => {
  const { roasteries, searchValue } = useContext(InventoryContext)

  // Set the page title
  usePageTitle('Roasteries')

  const items = roasteries
    .filter((roastery) =>
      roastery.name.toLowerCase().includes(searchValue.toLowerCase())
    )
    .map((item) => (
      <AccordionItemWithMenu key={item._id} item={item} variant='roastery' />
    ))

  return <Accordion chevronPosition='left'>{items}</Accordion>
}

export default RoasteriesPage
