// Fetch all coffees
const fetchCoffees = async (axiosInstance) => {
  try {
    const response = await axiosInstance.get('/api/coffees')
    return response.data
  } catch {
    throw new Error('Failed to fetch coffees')
  }
}

// Create a new coffee
const createCoffee = async (coffee, axiosInstance) => {
  try {
    const response = await axiosInstance.post('/api/coffees/create', coffee)
    return response.data
  } catch {
    throw new Error('Failed to create coffee')
  }
}

// Fetch one coffee for update
const fetchCoffeeForUpdate = async (coffeeId, axiosInstance) => {
  try {
    const response = await axiosInstance.get(`/api/coffees/${coffeeId}/update`)
    return response.data
  } catch {
    throw new Error('Failed to fetch coffee')
  }
}

// Update an existing coffee
const updateCoffee = async (coffee, axiosInstance) => {
  try {
    const response = await axiosInstance.put(
      `/api/coffees/${coffee._id}/update`,
      coffee
    )
    return response.data
  } catch {
    throw new Error('Failed to update coffee')
  }
}

// Toggle the archived status of an existing coffee
const toggleCoffeeArchiveStatus = async (
  coffeeId,
  isArchived,
  axiosInstance
) => {
  try {
    await axiosInstance.patch(`/api/coffees/${coffeeId}/archive`, {
      archived: isArchived,
    })
  } catch {
    console.error('Failed to update archive status')
  }
}

// Delete a coffee
const deleteCoffee = async (coffeeId, axiosInstance) => {
  try {
    await axiosInstance.delete(`/api/coffees/${coffeeId}/delete`)
  } catch {
    throw new Error('Failed to delete coffee')
  }
}

export {
  fetchCoffees,
  createCoffee,
  fetchCoffeeForUpdate,
  updateCoffee,
  toggleCoffeeArchiveStatus,
  deleteCoffee,
}
