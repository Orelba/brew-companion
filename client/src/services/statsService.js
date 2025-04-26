// Fetch all stats
const fetchStats = async (axiosInstance) => {
  try {
    const response = await axiosInstance.get('/api/stats')
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch stats')
  }
}

export { fetchStats }
