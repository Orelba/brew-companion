import { createContext, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const InventoryContext = createContext()

export const InventoryProvider = ({ children }) => {
  const [searchValue, setSearchValue] = useState('')

  // Extract the data from the queries if it exists, otherwise default to an empty array
  const { data: coffees = [] } = useQuery({
    queryKey: ['coffees'],
    queryFn: () => axios.get('/api/coffee').then((res) => res.data),
  })

  const { data: roasteries = [] } = useQuery({
    queryKey: ['roasteries'],
    queryFn: () => axios.get('/api/roasteries').then((res) => res.data),
  })

  return (
    <InventoryContext.Provider
      value={{ coffees, roasteries, searchValue, setSearchValue }}
    >
      {children}
    </InventoryContext.Provider>
  )
}
