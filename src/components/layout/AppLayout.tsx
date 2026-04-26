import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthContext'

export function AppLayout() {
  const { user, signOut } = useAuth()

  return (
    <div className="app-shell py-3 md:py-5">
      <header className="site-header relative overflow-hidden border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-indigo-50 shadow-sm">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-200/30 blur-2xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 h-36 w-36 rounded-full bg-sky-200/30 blur-2xl" />
        <div className="relative">
          <p className="eyebrow text-indigo-600">3D Furniture Preview</p>
          <span className="stat-pill mt-2">Immersive catalog experience</span>
          <h1 className="title text-slate-900">Visualize before you buy</h1>
          <p className="mt-1 text-sm text-slate-600">Interactive catalog, role-based admin pricing, and Firebase-ready architecture.</p>
        </div>

        <nav className="nav relative">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200' : 'bg-white/80 text-slate-700 hover:bg-slate-100'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/catalog"
            className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200' : 'bg-white/80 text-slate-700 hover:bg-slate-100'
              }`
            }
          >
            Catalog
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200' : 'bg-white/80 text-slate-700 hover:bg-slate-100'
              }`
            }
          >
            Admin
          </NavLink>
          {!user ? (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200' : 'bg-white/80 text-slate-700 hover:bg-slate-100'
                }`
              }
            >
              Login
            </NavLink>
          ) : null}
        </nav>

        <div className="account relative rounded-xl border border-slate-200 bg-white/85 p-3">
          {user ? (
            <>
              <small className="text-slate-700">
                Signed in as {user.email} ({user.role})
              </small>
              <button
                type="button"
                className="btn-primary"
                onClick={() => signOut()}
              >
                Sign out
              </button>
            </>
          ) : (
            <small className="text-slate-600">Sign in with your Firebase account.</small>
          )}
        </div>
      </header>

      <main className="page-wrap">
        <Outlet />
      </main>
    </div>
  )
}

