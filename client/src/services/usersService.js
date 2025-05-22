const USERS_URL = '/api/users'

const getCurrentUser = async (axiosInstance) => {
  try {
    const response = await axiosInstance.get(`${USERS_URL}/me`)
    return response.data
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred'

    throw new Error(`Failed to get current user: ${errorMessage}`)
  }
}

export { getCurrentUser }
