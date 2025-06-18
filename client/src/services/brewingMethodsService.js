// Fetch all brewing methods
const fetchBrewingMethods = async (axiosInstance) => {
  try {
    const response = await axiosInstance.get('/api/brewing-methods')
    return response.data
  } catch {
    throw new Error('Failed to fetch brewing methods')
  }
}

export { fetchBrewingMethods }
