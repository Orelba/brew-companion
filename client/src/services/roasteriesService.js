import axios from 'axios'

// Fetch all roasteries
const fetchRoasteries = async () => {
  try {
    const response = await axios.get('/api/roasteries')
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch roasteries')
  }
}

export { fetchRoasteries } 