import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../../domain/types'
import heroImage from '../../assets/hero.png'

interface FavoritesDrawerProps {
  open: boolean
  onClose: () => void
  products: Product[]
  favoriteIds: Set<string>
  onToggleFavorite: (productId: string) => void
  busyId: string | null
}

export function FavoritesDrawer({ open, onClose, products, favoriteIds, onToggleFavorite, busyId }: FavoritesDrawerProps) {
  const savedProducts = products.filter((p) => favoriteIds.has(p.id))

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <>
      <div
        className={`fav-overlay${open ? ' fav-overlay--open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fav-drawer${open ? ' fav-drawer--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Saved items"
      >
        <div className="fav-drawer__header">
          <h2 className="fav-drawer__title">
            Saved items
            {savedProducts.length > 0 && (
              <span className="fav-drawer__count">{savedProducts.length}</span>
            )}
          </h2>
          <button
            type="button"
            className="fav-drawer__close"
            onClick={onClose}
            aria-label="Close saved items"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="fav-drawer__body">
          {savedProducts.length === 0 ? (
            <div className="fav-drawer__empty">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <p>Nothing saved yet.<br />Hit <strong>Save</strong> on any product to add it here.</p>
            </div>
          ) : (
            <ul className="fav-list">
              {savedProducts.map((product) => {
                const imageSrc = product.imageUrl.trim() || heroImage
                const discountedPrice =
                  product.discountType === 'percent'
                    ? Math.max(0, product.price - (product.price * product.discountValue) / 100)
                    : product.discountType === 'fixed'
                      ? Math.max(0, product.price - product.discountValue)
                      : product.price
                const hasDiscount = product.discountType !== 'none' && product.discountValue > 0
                const busy = busyId === product.id

                return (
                  <li key={product.id} className="fav-item">
                    <img src={imageSrc} alt={product.name} className="fav-item__img" />
                    <div className="fav-item__info">
                      <Link
                        to={`/catalog/${product.id}`}
                        className="fav-item__name"
                        onClick={onClose}
                      >
                        {product.name}
                      </Link>
                      <p className="fav-item__price">
                        {hasDiscount ? (
                          <>
                            <strong>${discountedPrice.toLocaleString()}</strong>{' '}
                            <span className="fav-item__was">was ${product.price.toLocaleString()}</span>
                          </>
                        ) : (
                          <strong>${product.price.toLocaleString()}</strong>
                        )}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="fav-item__remove"
                      onClick={() => onToggleFavorite(product.id)}
                      disabled={busy}
                      aria-label={`Remove ${product.name} from saved`}
                    >
                      {busy ? (
                        '·'
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </aside>
    </>
  )
}
