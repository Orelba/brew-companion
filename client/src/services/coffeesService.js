import axios from 'axios'

// Fetch all coffees
const fetchCoffees = async () => {
  try {
    const response = await axios.get('/api/coffees')
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch coffees')
  }
}

export { fetchCoffees } 