import { useEffect, useState } from 'react'
import { ProductCard } from '../components/catalog/ProductCard'
import type { Product } from '../domain/types'
import { services } from '../services/serviceContainer'

export function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    services.products
      .listProducts()
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="state">Loading furniture catalog...</p>
  }

  return (
    <section className="page stack">
      <h2>Catalog</h2>
      <p>Browse available furniture items and open a live 3D preview.</p>
      <div className="catalog-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

