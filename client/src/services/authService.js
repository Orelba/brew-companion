import axiosInstance, { axiosPrivate } from './axiosInstance'

const AUTH_URL = '/api/auth'

const register = async (formValues) => {
  try {
    const response = await axiosInstance.post(
      `${AUTH_URL}/register`,
      formValues,
      { withCredentials: true }
    )
    return response?.data
  } catch (error) {
    if (!error?.response) {
      throw new Error('notifications.noServerResponse')
    }

    const { status, data } = error.response
    const errors = data.errors

    if (status === 409) {
      const field = errors[0]?.path // Assuming there's at least one error
      if (field === 'email') {
        throw new Error('notifications.emailAlreadyExists')
      } else if (field === 'username') {
        throw new Error('notifications.usernameAlreadyExists')
      } else {
        throw new Error('notifications.registrationFailed')
      }
    }

    if (status === 400 && Array.isArray(errors)) {
      const translationMap = {
        username: 'auth.validation.usernameInvalid',
        email: 'auth.validation.emailInvalid',
        password: 'auth.validation.passwordInvalid',
      }

      // Show the first error message from the array
      const errorMessage = translationMap[errors[0].path]
      if (errorMessage) {
        throw new Error(errorMessage)
      }
    }

    // Fallback for other statuses or if no specific error message is found
    throw new Error('notifications.registrationFailed')
  }
}

const login = async (formValues) => {
  try {
    const response = await axiosInstance.post(`${AUTH_URL}/login`, formValues, {
      withCredentials: true,
    })
    return response?.data
  } catch (error) {
    if (!error?.response) {
      throw new Error('notifications.noServerResponse')
    } else if (error.response?.status === 400) {
      throw new Error('notifications.missingEmailOrPassword')
    } else if (error.response?.status === 401) {
      throw new Error('notifications.invalidEmailOrPassword')
    } else {
      throw new Error('notifications.loginFailed')
    }
  }
}

const logout = async () => {
  try {
    await axiosInstance.get(`${AUTH_URL}/logout`, {
      withCredentials: true,
    })
  } catch (error) {
    throw error
  }
}

const forgotPassword = async (formValues) => {
  try {
    const response = await axiosInstance.post(
      `${AUTH_URL}/reset-password`,
      formValues
    )
    return response?.data
  } catch (error) {
    throw error
  }
}

const validatePasswordResetToken = async (token) => {
  try {
    const response = await axiosInstance.post(
      `${AUTH_URL}/reset-password/validate/${token}`
    )
    return response
  } catch (error) {
    throw error
  }
}

const resetPassword = async (formValues, token) => {
  try {
    const response = await axiosInstance.post(
      `${AUTH_URL}/reset-password/${token}`,
      formValues
    )
    return response
  } catch (error) {
    throw error
  }
}

const refreshAccessToken = async () => {
  try {
    const response = await axiosPrivate.post(
      `${AUTH_URL}/refresh`,
      {}, // Empty body
      {
        withCredentials: true,
      }
    )
    return response.data
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred'

    throw new Error(`Failed to get refresh token: ${errorMessage}`)
  }
}

export {
  register,
  login,
  logout,
  forgotPassword,
  validatePasswordResetToken,
  resetPassword,
  refreshAccessToken,
}
