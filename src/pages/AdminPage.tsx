import { useEffect, useState } from 'react'
import type { Product } from '../domain/types'
import { services } from '../services/serviceContainer'

export function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    services.products
      .listProducts()
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="state">Loading admin dashboard...</p>
  }

  return (
    <section className="page stack">
      <h2>Admin dashboard</h2>
      <p>
        CRUD UI scaffold is ready. Actions are connected to mock services now and can be switched to
        Firebase adapters later.
      </p>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Model URL</th>
              <th>Purchase URL</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>${product.price.toLocaleString()}</td>
                <td>{product.modelUrl ? 'Connected' : 'Pending upload'}</td>
                <td>{product.purchaseUrl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="panel stack">
        <h3>Next Firebase wiring points</h3>
        <ol>
          <li>Replace `services.products` mock with Firestore collection adapters.</li>
          <li>Bind image/model upload fields to Firebase Storage URLs.</li>
          <li>Protect write actions with Firebase rules for admin users only.</li>
        </ol>
      </div>
    </section>
  )
}

