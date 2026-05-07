import { useEffect, useState } from 'react'
import { ProductCard } from '../components/catalog/ProductCard'
import { FavoritesDrawer } from '../components/catalog/FavoritesDrawer'
import type { Product } from '../domain/types'
import { useAuth } from '../features/auth/AuthContext'
import { services } from '../services/serviceContainer'

export function CatalogPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [favoriteBusyId, setFavoriteBusyId] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    services.products
      .listProducts()
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!user) {
      setFavoriteIds(new Set())
      return
    }

    services.preferences
      .listFavoriteProductIds(user.id)
      .then((ids) => setFavoriteIds(new Set(ids)))
      .catch(() => setFavoriteIds(new Set()))
  }, [user])

  const handleToggleFavorite = async (productId: string) => {
    if (!user) return

    setFavoriteBusyId(productId)
    try {
      const nextIsFavorite = await services.preferences.toggleFavorite(user.id, productId)
      setFavoriteIds((current) => {
        const next = new Set(current)
        if (nextIsFavorite) {
          next.add(productId)
        } else {
          next.delete(productId)
        }
        return next
      })
    } finally {
      setFavoriteBusyId(null)
    }
  }

  if (loading) {
    return <p className="state">Loading furniture catalog...</p>
  }

  return (
    <>
      <section className="page stack bg-linear-to-b from-white to-slate-50">
        <div className="section-hero">
          <div className="row split gap-3">
            <h2 className="text-2xl font-semibold text-slate-900">Catalog</h2>
            <div className="row gap-2">
              {user ? (
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="fav-open-btn"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill={favoriteIds.size > 0 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  Saved
                  {favoriteIds.size > 0 && (
                    <span className="fav-badge">{favoriteIds.size}</span>
                  )}
                </button>
              ) : null}
              <span className="stat-pill">{products.length} items</span>
            </div>
          </div>
          <p className="mt-1 text-slate-600">Browse available furniture items and open a live 3D preview.</p>
          {user ? <p className="mt-1 text-sm text-indigo-700">Signed in: save items to your favorites list.</p> : null}
        </div>
        <div className="catalog-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorite={favoriteIds.has(product.id)}
              onToggleFavorite={user ? () => void handleToggleFavorite(product.id) : undefined}
              favoriteBusy={favoriteBusyId === product.id}
            />
          ))}
        </div>
      </section>

      {user && (
        <FavoritesDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          products={products}
          favoriteIds={favoriteIds}
          onToggleFavorite={(id) => void handleToggleFavorite(id)}
          busyId={favoriteBusyId}
        />
      )}
    </>
  )
}
