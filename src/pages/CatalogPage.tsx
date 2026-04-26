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

  return (
    <section className="page stack bg-gradient-to-b from-white to-slate-50">
      <div className="section-hero">
        <div className="row split gap-3">
          <h2 className="text-2xl font-semibold text-slate-900">Catalog</h2>
          <span className="stat-pill">{products.length} items</span>
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
  )
}

