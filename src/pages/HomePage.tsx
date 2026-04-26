import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <section className="page stack bg-gradient-to-b from-white via-slate-50 to-indigo-50">
      <div className="section-hero">
        <p className="stat-pill">Real-time 3D + Firebase-ready architecture</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Furniture shopping with studio-quality previews</h2>
        <p className="mt-2 max-w-3xl text-slate-600">
          Customers can rotate, zoom, and inspect furniture before purchase. The UI is intentionally built with service
          interfaces so Firebase Auth, Firestore, and Storage can be attached with minimal refactoring.
        </p>
      </div>

      <div className="hero-grid">
        <article className="panel border-slate-200 bg-white shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">What users can do</h3>
          <ul className="mt-2 space-y-1.5 text-slate-600">
            <li>Browse products and open an interactive 3D viewer</li>
            <li>Switch camera viewpoints for scale and design checks</li>
            <li>Jump to the main e-commerce purchase page</li>
          </ul>
        </article>
        <article className="panel border-slate-200 bg-white shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">What admins can do</h3>
          <ul className="mt-2 space-y-1.5 text-slate-600">
            <li>Review furniture entries and metadata</li>
            <li>Add, edit, and delete catalog records (service-ready scaffold)</li>
            <li>Prepare data shape for Firestore and Storage URLs</li>
          </ul>
        </article>
      </div>

      <div className="row gap-2">
        <Link to="/catalog" className="button-link btn-primary">
          Open catalog
        </Link>
        <Link to="/admin" className="button-link btn-secondary">
          Go to admin
        </Link>
      </div>
    </section>
  )
}

