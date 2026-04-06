import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <section className="page stack">
      <h2>Furniture shopping with real-time 3D previews</h2>
      <p>
        Customers can rotate, zoom, and inspect furniture before purchase. The UI is intentionally
        built with service interfaces so Firebase Auth, Firestore, and Storage can be attached with
        minimal refactoring.
      </p>

      <div className="hero-grid">
        <article className="panel">
          <h3>What users can do</h3>
          <ul>
            <li>Browse products and open an interactive 3D viewer</li>
            <li>Switch camera viewpoints for scale and design checks</li>
            <li>Jump to the main e-commerce purchase page</li>
          </ul>
        </article>
        <article className="panel">
          <h3>What admins can do</h3>
          <ul>
            <li>Review furniture entries and metadata</li>
            <li>Add, edit, and delete catalog records (service-ready scaffold)</li>
            <li>Prepare data shape for Firestore and Storage URLs</li>
          </ul>
        </article>
      </div>

      <div className="row">
        <Link to="/catalog" className="button-link">
          Open catalog
        </Link>
        <Link to="/admin" className="button-link ghost">
          Go to admin
        </Link>
      </div>
    </section>
  )
}

