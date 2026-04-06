import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="page stack narrow">
      <h2>Page not found</h2>
      <p>The page you requested does not exist.</p>
      <Link to="/" className="button-link">
        Back to home
      </Link>
    </section>
  )
}

