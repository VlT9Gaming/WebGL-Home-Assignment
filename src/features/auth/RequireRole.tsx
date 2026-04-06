import type { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import type { UserRole } from '../../domain/types'
import { useAuth } from './AuthContext'

interface RequireRoleProps {
  role: UserRole
}

export function RequireRole({ role, children }: PropsWithChildren<RequireRoleProps>) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <p className="state">Checking access...</p>
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (user.role !== role) {
    return (
      <section className="stack page narrow">
        <h2>Access restricted</h2>
        <p>
          This area is for {role} accounts. You are currently signed in as a {user.role}.
        </p>
      </section>
    )
  }

  return <>{children}</>
}

