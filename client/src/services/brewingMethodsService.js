import axios from 'axios'

// Fetch all brewing methods
const fetchBrewingMethods = async () => {
  try {
    const response = await axios.get('/api/brewing-methods')
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch brewing methods')
  }
}

export { fetchBrewingMethods } 