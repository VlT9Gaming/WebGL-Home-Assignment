import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import type { DiscountType, Product } from '../domain/types'
import { services } from '../services/serviceContainer'

interface PricingForm {
  price: number
  discountType: DiscountType
  discountValue: number
}

const emptyForm = (): PricingForm => ({
  price: 0,
  discountType: 'none',
  discountValue: 0,
})

const formatPrice = (price: number) => `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`

const getDiscountedPrice = (price: number, discountType: DiscountType, discountValue: number): number => {
  if (discountType === 'percent') {
    return Math.max(0, price - (price * discountValue) / 100)
  }
  if (discountType === 'fixed') {
    return Math.max(0, price - discountValue)
  }
  return price
}

const getDiscountLabel = (discountType: DiscountType, discountValue: number): string => {
  if (discountType === 'percent') {
    return `${discountValue}% off`
  }
  if (discountType === 'fixed') {
    return `${formatPrice(discountValue)} off`
  }
  return 'No discount'
}

const validatePricingForm = (form: PricingForm): string | null => {
  if (!Number.isFinite(form.price) || form.price < 0) return 'Base price must be a non-negative number.'
  if (!Number.isFinite(form.discountValue) || form.discountValue < 0) {
    return 'Discount value must be a non-negative number.'
  }
  if (form.discountType === 'percent' && form.discountValue > 100) {
    return 'Percent discount must be between 0 and 100.'
  }
  if (form.discountType === 'fixed' && form.discountValue > form.price) {
    return 'Fixed discount cannot be greater than the base price.'
  }
  return null
}

export function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<PricingForm>(emptyForm)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const isEditing = useMemo(() => Boolean(editingId), [editingId])
  const selectedProduct = useMemo(
    () => products.find((product) => product.id === editingId) ?? null,
    [editingId, products],
  )

  const loadProducts = async () => {
    setLoading(true)
    setLoadError(null)

    try {
      const list = await services.products.listProducts()
      setProducts(list)
    } catch {
      setLoadError('Unable to load products right now.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadProducts()
  }, [])

  const onFieldChange =
    (field: keyof PricingForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = field === 'price' || field === 'discountValue' ? Number(event.target.value) : event.target.value
      setForm((current) => ({ ...current, [field]: value }))
    }

  const resetForm = () => {
    setForm(emptyForm())
    setEditingId(null)
    setFormError(null)
  }

  const handleUpdatePricing = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setNotice(null)

    if (!editingId) {
      setFormError('Choose a product from the table before saving pricing changes.')
      return
    }

    const validationError = validatePricingForm(form)
    if (validationError) {
      setFormError(validationError)
      return
    }

    setSubmitting(true)
    setFormError(null)

    try {
      const updates: Partial<Omit<Product, 'id'>> = {
        price: form.price,
        discountType: form.discountType,
        discountValue: form.discountType === 'none' ? 0 : form.discountValue,
      }
      const updated = await services.products.updateProduct(editingId, updates)
      if (!updated) {
        setFormError('Unable to find product to update.')
        return
      }

      setProducts((current) => current.map((product) => (product.id === editingId ? updated : product)))
      setNotice(`Updated pricing for ${updated.name}.`)
    } catch {
      setFormError('Unable to save pricing changes. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (product: Product) => {
    setNotice(null)
    setEditingId(product.id)
    setForm({
      price: product.price,
      discountType: product.discountType,
      discountValue: product.discountValue,
    })
  }

  if (loading) {
    return <p className="state">Loading admin dashboard...</p>
  }

  return (
    <section className="page stack">
      <h2>Admin pricing controls</h2>
      <p>Update base price and discounts for existing products.</p>

      {loadError ? <p className="error-text">{loadError}</p> : null}

      <form onSubmit={handleUpdatePricing} className="stack form-panel">
        <h3>{isEditing ? `Edit pricing: ${selectedProduct?.name ?? ''}` : 'Select a product to edit pricing'}</h3>

        <label>
          Base price
          <input
            type="number"
            min={0}
            step="0.01"
            value={form.price}
            onChange={onFieldChange('price')}
            required
            disabled={!isEditing}
          />
        </label>

        <label>
          Discount type
          <select value={form.discountType} onChange={onFieldChange('discountType')} disabled={!isEditing}>
            <option value="none">No discount</option>
            <option value="percent">Percent (%)</option>
            <option value="fixed">Fixed amount ($)</option>
          </select>
        </label>

        <label>
          Discount value
          <input
            type="number"
            min={0}
            step="0.01"
            value={form.discountValue}
            onChange={onFieldChange('discountValue')}
            disabled={!isEditing || form.discountType === 'none'}
          />
        </label>

        {formError ? <p className="error-text">{formError}</p> : null}
        {notice ? <p className="hint">{notice}</p> : null}

        <div className="row">
          <button type="submit" disabled={submitting || !isEditing}>
            {submitting ? 'Saving...' : 'Save pricing'}
          </button>
          {isEditing ? (
            <button type="button" className="ghost" onClick={resetForm} disabled={submitting}>
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Base price</th>
              <th>Discount</th>
              <th>Final price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{formatPrice(product.price)}</td>
                <td>{getDiscountLabel(product.discountType, product.discountValue)}</td>
                <td>{formatPrice(getDiscountedPrice(product.price, product.discountType, product.discountValue))}</td>
                <td>
                  <div className="row">
                    <button type="button" className="ghost" onClick={() => handleEdit(product)}>
                      Edit pricing
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

