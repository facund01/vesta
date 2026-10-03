import axiosClient from './axiosClient'

// --- Autenticación y Perfil ---
export const loginRequest = (credentials) => axiosClient.post('/auth/login', credentials)
export const getProfileRequest = () => axiosClient.get('/auth/profile')
export const updateProfileRequest = (data) => axiosClient.put('/auth/profile', data)
export const forgotPasswordRequest = (email) => axiosClient.post('/auth/forgot-password', { email })
export const resetPasswordRequest = (token, password) => axiosClient.put(`/auth/reset-password/${token}`, { password })

// --- Categorías ---
export const getCategoriesRequest = () => axiosClient.get('/categories')
export const getCategoryByIdRequest = (id) => axiosClient.get(`/categories/${id}`)
export const createCategoryRequest = (data) => axiosClient.post('/categories', data)
export const updateCategoryRequest = (id, data) => axiosClient.put(`/categories/${id}`, data)
export const deleteCategoryRequest = (id) => axiosClient.delete(`/categories/${id}`)

// --- Propiedades ---
export const getPropertiesRequest = (params) => axiosClient.get('/properties', { params })
export const getPropertyByIdRequest = (id) => axiosClient.get(`/properties/${id}`)
export const getAdminPropertiesRequest = () => axiosClient.get('/properties/admin/all')
export const createPropertyRequest = (data) => axiosClient.post('/properties', data)
export const updatePropertyRequest = (id, data) => axiosClient.put(`/properties/${id}`, data)
export const updatePropertyStatusRequest = (id, statusData) => axiosClient.patch(`/properties/${id}/status`, statusData)
export const deletePropertyRequest = (id) => axiosClient.delete(`/properties/${id}`)

// --- Información Institucional ---
export const getCompanyInfoRequest = () => axiosClient.get('/company')
export const updateCompanyInfoRequest = (data) => axiosClient.put('/company', data)

// --- Consultas / Inquiries ---
export const sendInquiryRequest = (data) => axiosClient.post('/inquiries', data)
export const getInquiriesRequest = (params) => axiosClient.get('/inquiries', { params })
export const updateInquiryStatusRequest = (id, status) => axiosClient.patch(`/inquiries/${id}/status`, { estado: status })
export const deleteInquiryRequest = (id) => axiosClient.delete(`/inquiries/${id}`)

// --- Estadísticas ---
export const getDashboardStatsRequest = () => axiosClient.get('/stats/dashboard')