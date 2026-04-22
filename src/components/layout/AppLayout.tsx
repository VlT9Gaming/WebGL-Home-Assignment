import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthContext'

export function AppLayout() {
  const { user, signOut } = useAuth()

  return (
    <div className="app-shell">
      <header className="site-header">
        <div>
          <p className="eyebrow">3D Furniture Preview</p>
          <h1 className="title">Visualize before you buy</h1>
        </div>

        <nav className="nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/catalog">Catalog</NavLink>
          <NavLink to="/admin">Admin</NavLink>
          {!user ? <NavLink to="/login">Login</NavLink> : null}
        </nav>

        <div className="account">
          {user ? (
            <>
              <small>
                Signed in as {user.email} ({user.role})
              </small>
              <button type="button" onClick={() => signOut()}>
                Sign out
              </button>
            </>
          ) : (
            <small>Sign in with your Firebase account.</small>
          )}
        </div>
      </header>

      <main className="page-wrap">
        <Outlet />
      </main>
    </div>
  )
}

