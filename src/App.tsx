import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { RequireRole } from './features/auth/RequireRole'
import { AdminPage } from './pages/AdminPage'
import { CatalogPage } from './pages/CatalogPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProductPage } from './pages/ProductPage'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="catalog/:productId" element={<ProductPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route
          path="admin"
          element={
            <RequireRole role="admin">
              <AdminPage />
            </RequireRole>
          }
        />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
      <Route path="home" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
