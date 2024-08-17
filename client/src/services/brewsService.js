import axios from 'axios'

// Fetch all brews
const fetchBrews = async () => {
  try {
    const response = await axios.get('/api/brews')
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch brews')
  }
}

// Fetch recent brews in a minimal format
const fetchRecentBrews = async () => {
  try {
    const response = await axios.get('/api/brews/recent')
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch brews')
  }
}

// Create a new brew
const createBrew = async (brew) => {
  try {
    const response = await axios.post('/api/brews/create', brew)
    return response.data
  } catch (error) {
    throw new Error('Failed to create brew')
  }
}

// Fetch one brew for update (Unpopulated fields)
const fetchBrewForUpdate = async (brewId) => {
  try {
    const response = await axios.get(`/api/brews/${brewId}/update`)
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch brew')
  }
}

// Update an existing brew
const updateBrew = async (brew) => {
  try {
    const response = await axios.put(`/api/brews/${brew._id}/update`, brew)
    return response.data
  } catch (error) {
    throw new Error('Failed to update brew')
  }
}

// Delete a brew
const deleteBrew = async (brew) => {
  try {
    await axios.delete(`/api/brews/${brew._id}/delete`)
  } catch (error) {
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
