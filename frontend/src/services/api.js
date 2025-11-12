import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password })
  return response.data
}

export const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgot-password', { email })
  return response.data
}

export const resetPassword = async (token, newPassword) => {
  return api.post('/auth/reset-password', { token, newPassword })
}

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export const getTenants = async () => {
  const response = await api.get('/tenants')
  return response.data
}

export const createTenant = async (data) => {
  const response = await api.post('/tenants', data)
  return response.data
}

export const updateTenant = async (id, data) => {
  const response = await api.put(`/tenants/${id}`, data)
  return response.data
}

export const deleteTenant = async (id) => {
  await api.delete(`/tenants/${id}`)
}

export const getUsers = async () => {
  const response = await api.get('/users')
  return response.data
}

export const createUser = async (data) => {
  const response = await api.post('/users', data)
  return response.data
}

export const updateUser = async (id, data) => {
  const response = await api.put(`/users/${id}`, data)
  return response.data
}

export const deleteUser = async (id) => {
  await api.delete(`/users/${id}`)
}

export const getDishes = async () => {
  const response = await api.get('/dishes')
  return response.data
}

export const getDishesToday = async () => {
  const response = await api.get('/dishes/today')
  return response.data
}

export const createDish = async (data) => {
  const response = await api.post('/dishes', data)
  return response.data
}

export const updateDish = async (id, data) => {
  const response = await api.put(`/dishes/${id}`, data)
  return response.data
}

export const deleteDish = async (id) => {
  await api.delete(`/dishes/${id}`)
}

export const getOrders = async (date) => {
  const params = date ? { date: date.toISOString() } : {}
  const response = await api.get('/orders', { params })
  return response.data
}

export const getMyOrder = async () => {
  const response = await api.get('/orders/my-order')
  return response.data
}

export const canOrder = async () => {
  const response = await api.get('/orders/can-order')
  return response.data
}

export const createOrder = async (dishId) => {
  const response = await api.post('/orders', { dishId })
  return response.data
}

export const getMonthlyReport = async (year, month) => {
  const response = await api.get('/reports/monthly', {
    params: { year, month },
    responseType: 'blob'
  })
  return response.data
}

export const getDailyReport = async (date) => {
  const response = await api.get('/reports/daily', {
    params: { date: date.toISOString() },
    responseType: 'blob'
  })
  return response.data
}

export default api