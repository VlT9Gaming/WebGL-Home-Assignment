import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <section className="page stack bg-linear-to-b from-white via-slate-50 to-indigo-50">
      <div className="section-hero">
        <p className="stat-pill">Interactive 3D furniture preview</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          See it in 3D before it's in your home
        </h2>
        <p className="mt-2 max-w-2xl text-slate-600">
          Browse our furniture catalog and open a live, interactive 3D preview for any item. Rotate,
          zoom, and inspect from every angle — so you know exactly what you're getting before you buy.
        </p>
        <div className="mt-4 row gap-2">
          <Link to="/catalog" className="button-link btn-primary">
            Browse catalog
          </Link>
          <Link to="/login" className="button-link btn-secondary">
            Sign in
          </Link>
        </div>
      </div>

      <div className="hero-grid">
        <article className="panel border-slate-200 bg-white shadow-sm stack">
          <div className="text-2xl">🪑</div>
          <h3 className="text-lg font-semibold text-slate-900">Interactive 3D viewer</h3>
          <p className="text-sm text-slate-600">
            Every product has a fully interactive 3D model. Spin it around, zoom in on the details,
            and switch between front, side, and top views to get a complete picture.
          </p>
        </article>

        <article className="panel border-slate-200 bg-white shadow-sm stack">
          <div className="text-2xl">🛒</div>
          <h3 className="text-lg font-semibold text-slate-900">Shop with confidence</h3>
          <p className="text-sm text-slate-600">
            No more guessing from flat photos. Inspect the material, silhouette, and proportions
            up close, then head straight to the store to complete your purchase.
          </p>
        </article>

        <article className="panel border-slate-200 bg-white shadow-sm stack">
          <div className="text-2xl">❤️</div>
          <h3 className="text-lg font-semibold text-slate-900">Save your favourites</h3>
          <p className="text-sm text-slate-600">
            Sign in to bookmark the pieces you love. Your saved items are always there when you're
            ready to decide, across any device.
          </p>
        </article>
      </div>

      <div className="section-hero">
        <h3 className="text-lg font-semibold text-slate-900">How it works</h3>
        <ol className="mt-2 space-y-2 text-slate-600 text-sm list-none" style={{ paddingLeft: 0 }}>
          <li className="flex gap-3 items-start">
            <span className="stat-pill shrink-0">1</span>
            <span>Open the catalog and pick any piece of furniture that catches your eye.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="stat-pill shrink-0">2</span>
            <span>Click <strong>Open 3D preview</strong> to load the interactive model in your browser — no app needed.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="stat-pill shrink-0">3</span>
            <span>When you're ready, hit <strong>Continue to purchase</strong> to go straight to the store.</span>
          </li>
        </ol>
      </div>
    </section>
  )
}
