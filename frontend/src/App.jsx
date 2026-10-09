import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { ScrollToTop } from './components/ScrollToTop'

// Layouts
import { PublicLayout } from './components/PublicLayout'
import { AdminLayout } from './components/AdminLayout'

// Páginas Públicas
import { HomePage } from './pages/public/HomePage'
import { PropertiesPage } from './pages/public/PropertiesPage'
import { PropertyDetailPage } from './pages/public/PropertyDetailPage'
import { ContactPage } from './pages/public/ContactPage'
import { LoginPage } from './pages/public/LoginPage'
import { ResetPasswordPage } from './pages/public/ResetPasswordPage'

// Páginas Administrativas
import { DashboardPage } from './pages/admin/DashboardPage'
import { AdminPropertiesPage } from './pages/admin/AdminPropertiesPage'
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage'
import { AdminInquiriesPage } from './pages/admin/AdminInquiriesPage'
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage'

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          {/* Rutas Públicas */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/propiedades" element={<PropertiesPage />} />
            <Route path="/propiedades/:id" element={<PropertyDetailPage />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          </Route>

          {/* Rutas Protegidas bajo AdminLayout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<DashboardPage />} />
              <Route path="/admin/propiedades" element={<AdminPropertiesPage />} />
              <Route path="/admin/categorias" element={<AdminCategoriesPage />} />
              <Route path="/admin/consultas" element={<AdminInquiriesPage />} />
              <Route path="/admin/configuracion" element={<AdminSettingsPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App