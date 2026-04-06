import { Link } from 'react-router-dom'
import type { Product } from '../../domain/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="card">
      <img src={product.imageUrl} alt={product.name} />
      <div className="stack">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p>
          <strong>${product.price.toLocaleString()}</strong>
        </p>
      </div>
      <div className="row">
        <Link to={`/catalog/${product.id}`} className="button-link">
          Open 3D preview
        </Link>
        <a href={product.purchaseUrl} target="_blank" rel="noreferrer" className="button-link ghost">
          Buy on store
        </a>
      </div>
    </article>
  )
}

