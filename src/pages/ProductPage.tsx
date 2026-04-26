import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProductViewer } from '../components/viewer/ProductViewer'
import type { Product } from '../domain/types'
import { useAuth } from '../features/auth/AuthContext'
import { services } from '../services/serviceContainer'

type CameraView = 'front' | 'side' | 'top'

export function ProductPage() {
  const { user } = useAuth()
  const { productId } = useParams<{ productId: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(() => Boolean(productId))
  const [cameraView, setCameraView] = useState<CameraView>('front')
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteBusy, setFavoriteBusy] = useState(false)
  const [viewerAutoRotate, setViewerAutoRotate] = useState(false)

  useEffect(() => {
    if (!productId) {
      return
    }

    services.products
      .getProductById(productId)
      .then(setProduct)
      .finally(() => setLoading(false))
  }, [productId])

  useEffect(() => {
    if (!user || !productId) {
      setIsFavorite(false)
      return
    }

    services.preferences
      .isFavorite(user.id, productId)
      .then(setIsFavorite)
      .catch(() => setIsFavorite(false))
  }, [productId, user])

  useEffect(() => {
    if (!user) {
      setViewerAutoRotate(false)
      return
    }

    services.preferences
      .getPreferences(user.id)
      .then((preferences) => setViewerAutoRotate(preferences.viewerAutoRotate))
      .catch(() => setViewerAutoRotate(false))
  }, [user])

  const toggleFavorite = async () => {
    if (!user || !product) {
      return
    }

    setFavoriteBusy(true)
    try {
      const next = await services.preferences.toggleFavorite(user.id, product.id)
      setIsFavorite(next)
    } finally {
      setFavoriteBusy(false)
    }
  }

  const handleAutoRotateChange = (enabled: boolean) => {
    setViewerAutoRotate(enabled)
    if (!user) {
      return
    }
    void services.preferences.updatePreferences(user.id, { viewerAutoRotate: enabled })
  }

  if (loading) {
    return <p className="state">Loading product...</p>
  }

  if (!product) {
    return (
      <section className="page stack narrow bg-white/90">
        <h2 className="text-2xl font-semibold text-slate-900">Product not found</h2>
        <Link className="button-link btn-secondary" to="/catalog">
          Back to catalog
        </Link>
      </section>
    )
  }

  const discountedPrice =
    product.discountType === 'percent'
      ? Math.max(0, product.price - (product.price * product.discountValue) / 100)
      : product.discountType === 'fixed'
        ? Math.max(0, product.price - product.discountValue)
        : product.price
  const hasDiscount = product.discountType !== 'none' && product.discountValue > 0

  return (
    <section className="page stack bg-linear-to-b from-white to-slate-50">
      <div className="section-hero">
        <span className="stat-pill">Interactive 3D product preview</span>
        <div className="row split gap-4 rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <div className="stack flex-1">
          <h2 className="text-2xl font-semibold text-slate-900">{product.name}</h2>
          <p className="text-slate-600">{product.description}</p>
          <p className="text-slate-700">
            <strong className="text-xl text-slate-900">${discountedPrice.toLocaleString()}</strong>
            {hasDiscount ? <span className="text-slate-500"> (was ${product.price.toLocaleString()})</span> : null} -{' '}
            {product.materialHint}
          </p>
          <p className="text-sm text-slate-500">{product.dimensions}</p>
        </div>

        <div className="row w-full sm:w-auto sm:justify-end">
          <a
            href={product.purchaseUrl}
            target="_blank"
            rel="noreferrer"
            className="button-link btn-success w-full sm:w-auto"
          >
            Continue to purchase
          </a>
          <Link className="button-link btn-secondary w-full sm:w-auto" to="/catalog">
            Back
          </Link>
          {user ? (
            <button
              type="button"
              className="button-link btn-ghost w-full sm:w-auto"
              onClick={() => void toggleFavorite()}
              disabled={favoriteBusy}
            >
              {favoriteBusy ? 'Saving...' : isFavorite ? 'Unsave item' : 'Save item'}
            </button>
          ) : null}
        </div>
      </div>
      </div>

      <div className="row gap-2 rounded-xl border border-slate-200 bg-white p-3">
        <button
          type="button"
          className={cameraView === 'front' ? 'btn-primary' : 'btn-ghost'}
          onClick={() => setCameraView('front')}
        >
          Front view
        </button>
        <button
          type="button"
          className={cameraView === 'side' ? 'btn-primary' : 'btn-ghost'}
          onClick={() => setCameraView('side')}
        >
          Side view
        </button>
        <button
          type="button"
          className={cameraView === 'top' ? 'btn-primary' : 'btn-ghost'}
          onClick={() => setCameraView('top')}
        >
          Top view
        </button>
      </div>

      <ProductViewer
        product={product}
        cameraPosition={product.cameraPresets[cameraView]}
        autoRotate={viewerAutoRotate}
        onAutoRotateChange={handleAutoRotateChange}
      />
    </section>
  )
}

