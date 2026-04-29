import { useEffect, useState } from 'react'
import { ProductCard } from '../components/catalog/ProductCard'
import type { Product } from '../domain/types'
import { useAuth } from '../features/auth/AuthContext'
import { services } from '../services/serviceContainer'

export function CatalogPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [favoriteBusyId, setFavoriteBusyId] = useState<string | null>(null)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

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
    if (!user) {
      return
    }

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

  const displayedProducts = showFavoritesOnly
    ? products.filter((p) => favoriteIds.has(p.id))
    : products

  return (
    <section className="page stack bg-linear-to-b from-white to-slate-50">
      <div className="section-hero">
        <div className="row split gap-3">
          <h2 className="text-2xl font-semibold text-slate-900">Catalog</h2>
          <div className="row gap-2">
            {user ? (
              <button
                type="button"
                onClick={() => setShowFavoritesOnly((v) => !v)}
                className={`text-sm font-medium px-3 py-1.5 rounded-lg border transition ${
                  showFavoritesOnly
                    ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700'
                    : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {showFavoritesOnly ? '★ Favorites' : '☆ Favorites'}
              </button>
            ) : null}
            <span className="stat-pill">{displayedProducts.length} items</span>
          </div>
        </div>
        <p className="mt-1 text-slate-600">Browse available furniture items and open a live 3D preview.</p>
        {user ? <p className="mt-1 text-sm text-indigo-700">Signed in: save items to your favorites list.</p> : null}
      </div>
      <div className="catalog-grid">
        {displayedProducts.length === 0 && showFavoritesOnly ? (
          <p className="text-slate-500 text-sm col-span-full">No favorites saved yet. Browse the catalog and save items.</p>
        ) : (
          displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorite={favoriteIds.has(product.id)}
              onToggleFavorite={user ? () => void handleToggleFavorite(product.id) : undefined}
              favoriteBusy={favoriteBusyId === product.id}
            />
          ))
        )}
      </div>
    </section>
  )
}

