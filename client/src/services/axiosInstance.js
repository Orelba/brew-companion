import axios from 'axios'

export default axios.create({
  // baseURL: '/api',
})

export const axiosPrivate = axios.create({
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})
