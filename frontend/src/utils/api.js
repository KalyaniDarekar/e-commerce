import axios from 'axios'

import { store } from '../store/store'

const api = axios.create({
  baseURL: (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000') + '/api',
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const state = store.getState()
  const token = state.auth.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
