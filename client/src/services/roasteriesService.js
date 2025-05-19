// Fetch all roasteries
const fetchRoasteries = async (axiosInstance) => {
  try {
    const response = await axiosInstance.get('/api/roasteries')
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch roasteries')
  }
}

// Create a new roastery
const createRoastery = async (roastery, axiosInstance) => {
  try {
    const response = await axiosInstance.post(
      '/api/roasteries/create',
      roastery
    )
    return response.data
  } catch (error) {
    throw new Error('Failed to create roastery')
  }
}

// Fetch one roastery for update
const fetchRoasteryForUpdate = async (roasteryId, axiosInstance) => {
  try {
    const response = await axiosInstance.get(
      `/api/roasteries/${roasteryId}/update`
    )
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch roastery')
  }
}

// Update an existing roastery
const updateRoastery = async (roastery, axiosInstance) => {
  try {
    const response = await axiosInstance.put(
      `/api/roasteries/${roastery._id}/update`,
      roastery
    )
    return response.data
  } catch (error) {
    throw new Error('Failed to update roastery')
  }
}

// Delete a roastery
const deleteRoastery = async (roasteryId, axiosInstance) => {
  try {
    await axiosInstance.delete(`/api/roasteries/${roasteryId}/delete`)
  } catch (error) {
    throw new Error('Failed to delete roastery')
  }
}

export {
  fetchRoasteries,
  createRoastery,
  fetchRoasteryForUpdate,
  updateRoastery,
  deleteRoastery,
}
