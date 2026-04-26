import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="page stack narrow bg-white/90">
      <span className="stat-pill">404</span>
      <h2 className="text-2xl font-semibold text-slate-900">Page not found</h2>
      <p className="text-slate-600">The page you requested does not exist.</p>
      <Link to="/" className="button-link btn-secondary">
        Back to home
      </Link>
    </section>
  )
}

