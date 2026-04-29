import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { RequireRole } from './features/auth/RequireRole'
import { NotFoundPage } from './pages/NotFoundPage'

const AdminPage = lazy(() => import('./pages/AdminPage').then((m) => ({ default: m.AdminPage })))
const CatalogPage = lazy(() => import('./pages/CatalogPage').then((m) => ({ default: m.CatalogPage })))
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })))
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })))
const ProductPage = lazy(() => import('./pages/ProductPage').then((m) => ({ default: m.ProductPage })))

function App() {
  return (
    <Suspense fallback={null}>
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
    </Suspense>
  )
}

export default App
