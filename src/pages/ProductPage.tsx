import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProductViewer } from '../components/viewer/ProductViewer'
import type { Product } from '../domain/types'
import { services } from '../services/serviceContainer'

type CameraView = 'front' | 'side' | 'top'

export function ProductPage() {
  const { productId } = useParams<{ productId: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(() => Boolean(productId))
  const [cameraView, setCameraView] = useState<CameraView>('front')

  useEffect(() => {
    if (!productId) {
      return
    }

    services.products
      .getProductById(productId)
      .then(setProduct)
      .finally(() => setLoading(false))
  }, [productId])

  if (loading) {
    return <p className="state">Loading product...</p>
  }

  if (!product) {
    return (
      <section className="page stack narrow">
        <h2>Product not found</h2>
        <Link className="button-link" to="/catalog">
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
    <section className="page stack">
      <div className="row split">
        <div className="stack">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>
            <strong>${discountedPrice.toLocaleString()}</strong>
            {hasDiscount ? <span> (was ${product.price.toLocaleString()})</span> : null} - {product.materialHint}
          </p>
          <p>{product.dimensions}</p>
        </div>

        <div className="row">
          <a href={product.purchaseUrl} target="_blank" rel="noreferrer" className="button-link">
            Continue to purchase
          </a>
          <Link className="button-link ghost" to="/catalog">
            Back
          </Link>
        </div>
      </div>

      <div className="row">
        <button type="button" onClick={() => setCameraView('front')}>
          Front view
        </button>
        <button type="button" onClick={() => setCameraView('side')}>
          Side view
        </button>
        <button type="button" onClick={() => setCameraView('top')}>
          Top view
        </button>
      </div>

      <ProductViewer product={product} cameraPosition={product.cameraPresets[cameraView]} />
    </section>
  )
}

