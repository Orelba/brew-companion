const sendContactMessage = async (formData, axiosInstance) => {
  try {
    const response = await axiosInstance.post('/api/contact', formData)
    return response.data
  } catch {
    throw new Error('Failed to send message')
  }
}

export { sendContactMessage }
