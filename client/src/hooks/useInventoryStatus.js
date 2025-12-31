import { useContext } from 'react'
import InventoryContext from '../contexts/InventoryContext'

const useInventoryStatus = () => {
  const { brews, coffees, roasteries, isInventoryReady } =
    useContext(InventoryContext)

  const hasBrews = brews.data.length > 0
  const hasCoffees = coffees.data.length > 0
  const hasRoasteries = roasteries.data.length > 0

  return {
    isInventoryReady,
    hasBrews,
    hasCoffees,
    hasRoasteries,
    isInventoryComplete: hasBrews && hasCoffees && hasRoasteries,
  }
}

export default useInventoryStatus
