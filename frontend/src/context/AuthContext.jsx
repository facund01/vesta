import { createContext, useContext, useState, useEffect } from 'react'
import { loginRequest, getProfileRequest } from '../api/endpoints'

const AuthContext = createContext()

// Custom hook para consumir el contexto de autenticación de forma simple: useAuth()
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('vesta_token') || null)
  const [loading, setLoading] = useState(true)

  // Al recargar la página, verificamos si existe un token válido y recuperamos el perfil
  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedToken = localStorage.getItem('vesta_token')

      if (storedToken) {
        try {
          // Consultamos /auth/profile con el interceptor que inyecta el token
          const res = await getProfileRequest()
          setUser(res.data.data)
        } catch (error) {
          console.error('Sesión expirada o token inválido:', error)
          logout()
        }
      }

      setLoading(false)
    }

    checkAuthStatus()
  }, [])

  // Función de inicio de sesión
  const login = async (email, password) => {
    const res = await loginRequest({ email, password })
    const { token: receivedToken, ...userData } = res.data.data

    // Persistimos en localStorage para que no se pierda al refrescar el navegador (F5)
    localStorage.setItem('vesta_token', receivedToken)
    localStorage.setItem('vesta_user', JSON.stringify(userData))

    setToken(receivedToken)
    setUser(userData)
    return res.data
  }

  // Función de cierre de sesión
  const logout = () => {
    localStorage.removeItem('vesta_token')
    localStorage.removeItem('vesta_user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}