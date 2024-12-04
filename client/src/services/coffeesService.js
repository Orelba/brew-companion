// Fetch all coffees
const fetchCoffees = async (axiosInstance) => {
  try {
    const response = await axiosInstance.get('/api/coffees')
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch coffees')
  }
}

export { fetchCoffees }
