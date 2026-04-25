import { Link } from 'react-router-dom'
import type { Product } from '../../domain/types'
import heroImage from '../../assets/hero.png'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const imageSrc = product.imageUrl.trim() || heroImage
  const discountedPrice =
    product.discountType === 'percent'
      ? Math.max(0, product.price - (product.price * product.discountValue) / 100)
      : product.discountType === 'fixed'
        ? Math.max(0, product.price - product.discountValue)
        : product.price
  const hasDiscount = product.discountType !== 'none' && product.discountValue > 0

  return (
    <article className="card">
      <img src={imageSrc} alt={product.name} />
      <div className="stack">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p>
          {hasDiscount ? (
            <>
              <strong>${discountedPrice.toLocaleString()}</strong>{' '}
              <span className="hint">(was ${product.price.toLocaleString()})</span>
            </>
          ) : (
            <strong>${product.price.toLocaleString()}</strong>
          )}
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

