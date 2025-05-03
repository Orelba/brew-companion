// Fetch all roasteries
const fetchRoasteries = async (axiosInstance) => {
  try {
    const response = await axiosInstance.get('/api/roasteries')
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch roasteries')
  }
}

export { fetchRoasteries }
