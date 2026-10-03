import axios from 'axios'

// Creamos la instancia configurando la URL base desde las variables de entorno de Vite
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor de Petición: se ejecuta ANTES de que la solicitud salga hacia el backend
axiosClient.interceptors.request.use(
  (config) => {
    // Leemos el token que guardaremos en el localStorage al iniciar sesión
    const token = localStorage.getItem('vesta_token')

    if (token) {
      // Inyectamos el encabezado Authorization estándar
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor de Respuesta: se ejecuta cuando el backend nos responde
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el backend nos responde 401 (Token vencido o inválido), limpiamos sesión
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('vesta_token')
      localStorage.removeItem('vesta_user')
      // Si no estamos en la página de login, redirigimos limpiamente
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default axiosClient