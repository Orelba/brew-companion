import { createContext, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchBrews } from '../services/brewsService'
import { fetchCoffees } from '../services/coffeesService'
import { fetchRoasteries } from '../services/roasteriesService'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useAuth from '../hooks/useAuth'

const InventoryContext = createContext()

export const InventoryProvider = ({ children }) => {
  const [searchValue, setSearchValue] = useState('')
  const [isArchive, setIsArchive] = useState(false)

  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuth()
  const isAuthenticated = !!auth?.accessToken

  // Extract the data from the queries if it exists, otherwise default to an empty array
  const brews = useQuery({
    queryKey: ['brews'],
    queryFn: () => fetchBrews(axiosPrivate),
    placeholderData: [], // Default data to an empty array
    enabled: isAuthenticated,
  })

  const coffees = useQuery({
    queryKey: ['coffees'],
    queryFn: () => fetchCoffees(axiosPrivate),
    placeholderData: [], // Default data to an empty array
    enabled: isAuthenticated,
  })

  const roasteries = useQuery({
    queryKey: ['roasteries'],
    queryFn: () => fetchRoasteries(axiosPrivate),
    placeholderData: [], // Default data to an empty array
    enabled: isAuthenticated,
  })

  const isInventoryReady =
    !isAuthenticated ||
    (brews.isFetched && coffees.isFetched && roasteries.isFetched)

  return (
    <InventoryContext.Provider
      value={{
        brews,
        coffees,
        roasteries,
        isInventoryReady,
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

export default InventoryContext
