import { createContext, useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const InventoryContext = createContext()

export const InventoryProvider = ({ children }) => {
  const [coffees, setCoffees] = useState([])
  const [roasteries, setRoasteries] = useState([])
  const [searchValue, setSearchValue] = useState('')

  const coffeesQuery = useQuery({
    queryKey: ['coffees'],
    queryFn: () => axios.get('/api/coffee').then((res) => res.data),
  })

  const roasteriesQuery = useQuery({
    queryKey: ['roasteries'],
    queryFn: () => axios.get('/api/roasteries').then((res) => res.data),
  })

  useEffect(() => {
    if (coffeesQuery.data) {
      setCoffees(coffeesQuery.data)
    }
  }, [coffeesQuery.data])

  useEffect(() => {
    if (roasteriesQuery.data) {
      setRoasteries(roasteriesQuery.data)
    }
  }, [roasteriesQuery.data])

  return (
    <InventoryContext.Provider
      value={{ coffees, roasteries, searchValue, setSearchValue }}
    >
      {children}
    </InventoryContext.Provider>
  )
}
