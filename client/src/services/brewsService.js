// Fetch all brews
const fetchBrews = async (axiosInstance) => {
  try {
    const response = await axiosInstance.get('/api/brews')
    return response.data
  } catch {
    throw new Error('Failed to fetch brews')
  }
}

// Fetch recent brews in a minimal format
const fetchRecentBrews = async (axiosInstance) => {
  try {
    const response = await axiosInstance.get('/api/brews/recent')
    return response.data
  } catch {
    throw new Error('Failed to fetch brews')
  }
}

// Create a new brew
const createBrew = async (brew, axiosInstance) => {
  try {
    const response = await axiosInstance.post('/api/brews/create', brew)
    return response.data
  } catch {
    throw new Error('Failed to create brew')
  }
}

// Fetch one brew for update (Unpopulated fields)
const fetchBrewForUpdate = async (brewId, axiosInstance) => {
  try {
    const response = await axiosInstance.get(`/api/brews/${brewId}/update`)
    return response.data
  } catch {
    throw new Error('Failed to fetch brew')
  }
}

// Update an existing brew
const updateBrew = async (brew, axiosInstance) => {
  try {
    const response = await axiosInstance.put(
      `/api/brews/${brew._id}/update`,
      brew
    )
    return response.data
  } catch {
    throw new Error('Failed to update brew')
  }
}

// Delete a brew
const deleteBrew = async (brew, axiosInstance) => {
  try {
    await axiosInstance.delete(`/api/brews/${brew._id}/delete`)
  } catch {
    throw new Error('Failed to delete brew')
  }
}

export {
  fetchBrews,
  fetchRecentBrews,
  fetchBrewForUpdate,
  createBrew,
  updateBrew,
  deleteBrew,
}
