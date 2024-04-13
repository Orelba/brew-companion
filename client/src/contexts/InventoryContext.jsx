import { createContext, useState, useEffect } from 'react'
import axios from 'axios'

export const InventoryContext = createContext()

export const InventoryProvider = ({ children }) => {
  const [coffees, setCoffees] = useState([])
  const [roasteries, setRoasteries] = useState([])
  const [searchValue, setSearchValue] = useState('')

  // TODO: better error handling
  const fetchCoffees = async () => {
    try {
      const response = await axios.get('/api/coffee')
      setCoffees(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchRoasteries = async () => {
    try {
      const response = await axios.get('/api/roasteries')
      setRoasteries(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchCoffees()
    fetchRoasteries()
  }, [])

  return (
    <InventoryContext.Provider
      value={{ coffees, roasteries, searchValue, setSearchValue }}
    >
      {children}
    </InventoryContext.Provider>
  )
}
