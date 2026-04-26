import { Link } from 'react-router-dom'
import type { Product } from '../../domain/types'
import heroImage from '../../assets/hero.png'

interface ProductCardProps {
  product: Product
  isFavorite?: boolean
  onToggleFavorite?: () => void
  favoriteBusy?: boolean
}

export function ProductCard({ product, isFavorite = false, onToggleFavorite, favoriteBusy = false }: ProductCardProps) {
  const imageSrc = product.imageUrl.trim() || heroImage
  const discountedPrice =
    product.discountType === 'percent'
      ? Math.max(0, product.price - (product.price * product.discountValue) / 100)
      : product.discountType === 'fixed'
        ? Math.max(0, product.price - product.discountValue)
        : product.price
  const hasDiscount = product.discountType !== 'none' && product.discountValue > 0

  return (
    <article className="card border-slate-200/90 bg-white/95 shadow-sm">
      <img src={imageSrc} alt={product.name} />
      <div className="stack">
        <div className="space-y-1">
          <div className="row split gap-2">
            <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
            {hasDiscount ? <span className="stat-pill">{product.discountType === 'percent' ? `${product.discountValue}% off` : 'Discount'}</span> : null}
          </div>
          <p className="line-clamp-2 text-sm text-slate-600">{product.description}</p>
          {isFavorite ? <p className="text-xs font-medium text-indigo-600">Saved in favorites</p> : null}
        </div>
        <p className="text-sm text-slate-700">
          {hasDiscount ? (
            <>
              <strong className="text-base text-slate-900">${discountedPrice.toLocaleString()}</strong>{' '}
              <span className="hint">(was ${product.price.toLocaleString()})</span>
            </>
          ) : (
            <strong className="text-base text-slate-900">${product.price.toLocaleString()}</strong>
          )}
        </p>
      </div>
      <div className="row gap-2">
        <Link
          to={`/catalog/${product.id}`}
          className="button-link btn-primary"
        >
          Open 3D preview
        </Link>
        <a
          href={product.purchaseUrl}
          target="_blank"
          rel="noreferrer"
          className="button-link btn-secondary"
        >
          Buy on store
        </a>
        {onToggleFavorite ? (
          <button
            type="button"
            className="btn-ghost"
            onClick={onToggleFavorite}
            disabled={favoriteBusy}
          >
            {favoriteBusy ? 'Saving...' : isFavorite ? 'Unsave' : 'Save'}
          </button>
        ) : null}
      </div>
    </article>
  )
}

