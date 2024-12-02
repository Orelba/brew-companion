import { createContext, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchCoffees } from '../services/coffeesService'
import { fetchRoasteries } from '../services/roasteriesService'

export const InventoryContext = createContext()

export const InventoryProvider = ({ children }) => {
  const [searchValue, setSearchValue] = useState('')
  const [isArchive, setIsArchive] = useState(false)

  // Extract the data from the queries if it exists, otherwise default to an empty array
  const coffees = useQuery({
    queryKey: ['coffees'],
    queryFn: fetchCoffees,
    placeholderData: [], // Default data to an empty array
  })

  const roasteries = useQuery({
    queryKey: ['roasteries'],
    queryFn: fetchRoasteries,
    placeholderData: [], // Default data to an empty array
  })

  return (
    <InventoryContext.Provider
      value={{
        coffees,
        roasteries,
        searchValue,
        setSearchValue,
        isArchive,
        setIsArchive,
      }}
    >
      {children}
    </InventoryContext.Provider>
  )
}
