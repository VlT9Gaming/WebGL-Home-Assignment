import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import type { Product, ProductCameraPresets } from '../domain/types'
import { services } from '../services/serviceContainer'

const defaultCameraPresets: ProductCameraPresets = {
  front: [4, 2.2, 4],
  side: [5.5, 2, 0],
  top: [0.2, 6, 0.2],
}

const emptyForm = (): Omit<Product, 'id'> => ({
  name: '',
  description: '',
  price: 0,
  imageUrl: '',
  purchaseUrl: '',
  modelUrl: '',
  materialHint: '',
  dimensions: '',
  cameraPresets: defaultCameraPresets,
})

const formatPrice = (price: number) => `$${price.toLocaleString()}`

const validateProductForm = (product: Omit<Product, 'id'>): string | null => {
  if (!product.name.trim()) return 'Name is required.'
  if (!product.description.trim()) return 'Description is required.'
  if (!Number.isFinite(product.price) || product.price < 0) return 'Price must be a non-negative number.'
  if (!product.imageUrl.trim()) return 'Image URL is required.'
  if (!product.purchaseUrl.trim()) return 'Purchase URL is required.'
  if (!product.modelUrl?.trim()) return 'Model URL is required.'
  return null
}

export function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Product, 'id'>>(emptyForm)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const isEditing = useMemo(() => Boolean(editingId), [editingId])

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
    (field: keyof Omit<Product, 'id'>) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = field === 'price' ? Number(event.target.value) : event.target.value
      setForm((current) => ({ ...current, [field]: value }))
    }

  const resetForm = () => {
    setForm(emptyForm())
    setEditingId(null)
    setFormError(null)
  }

  const handleCreateOrUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setNotice(null)

    const validationError = validateProductForm(form)
    if (validationError) {
      setFormError(validationError)
      return
    }

    setSubmitting(true)
    setFormError(null)

    try {
      if (editingId) {
        const updated = await services.products.updateProduct(editingId, form)
        if (!updated) {
          setFormError('Unable to find product to update.')
          return
        }

        setProducts((current) => current.map((product) => (product.id === editingId ? updated : product)))
        setNotice(`Updated ${updated.name}.`)
      } else {
        const created = await services.products.createProduct(form)
        setProducts((current) => [created, ...current])
        setNotice(`Created ${created.name}.`)
      }

      resetForm()
    } catch {
      setFormError('Unable to save product. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (product: Product) => {
    setNotice(null)
    setEditingId(product.id)
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      purchaseUrl: product.purchaseUrl,
      modelUrl: product.modelUrl ?? '',
      materialHint: product.materialHint,
      dimensions: product.dimensions,
      cameraPresets: product.cameraPresets,
    })
  }

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Delete ${product.name}? This cannot be undone.`)) {
      return
    }

    setNotice(null)
    setDeletingId(product.id)
    setFormError(null)

    try {
      const deleted = await services.products.deleteProduct(product.id)
      if (!deleted) {
        setFormError('Unable to delete product. It may have already been removed.')
        return
      }

      setProducts((current) => current.filter((entry) => entry.id !== product.id))
      if (editingId === product.id) {
        resetForm()
      }
      setNotice(`Deleted ${product.name}.`)
    } catch {
      setFormError('Unable to delete product. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return <p className="state">Loading admin dashboard...</p>
  }

  return (
    <section className="page stack">
      <h2>Admin dashboard</h2>
      <p>Manage catalog products with create, update, and delete actions.</p>

      {loadError ? <p className="error-text">{loadError}</p> : null}

      <form onSubmit={handleCreateOrUpdate} className="stack form-panel">
        <h3>{isEditing ? 'Edit product' : 'Add product'}</h3>

        <label>
          Name
          <input value={form.name} onChange={onFieldChange('name')} required />
        </label>

        <label>
          Description
          <textarea value={form.description} onChange={onFieldChange('description')} rows={3} required />
        </label>

        <label>
          Price
          <input
            type="number"
            min={0}
            step="0.01"
            value={form.price}
            onChange={onFieldChange('price')}
            required
          />
        </label>

        <label>
          Image URL
          <input type="url" value={form.imageUrl} onChange={onFieldChange('imageUrl')} required />
        </label>

        <label>
          Purchase URL
          <input type="url" value={form.purchaseUrl} onChange={onFieldChange('purchaseUrl')} required />
        </label>

        <label>
          Model URL
          <input type="url" value={form.modelUrl ?? ''} onChange={onFieldChange('modelUrl')} required />
        </label>

        <label>
          Dimensions
          <input value={form.dimensions} onChange={onFieldChange('dimensions')} placeholder="Optional" />
        </label>

        <label>
          Material hint
          <input value={form.materialHint} onChange={onFieldChange('materialHint')} placeholder="Optional" />
        </label>

        {formError ? <p className="error-text">{formError}</p> : null}
        {notice ? <p className="hint">{notice}</p> : null}

        <div className="row">
          <button type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : isEditing ? 'Save changes' : 'Create product'}
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
              <th>Price</th>
              <th>Model URL</th>
              <th>Purchase URL</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{formatPrice(product.price)}</td>
                <td>{product.modelUrl ? 'Connected' : 'Missing'}</td>
                <td>{product.purchaseUrl}</td>
                <td>
                  <div className="row">
                    <button type="button" className="ghost" onClick={() => handleEdit(product)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        void handleDelete(product)
                      }}
                      disabled={deletingId === product.id}
                    >
                      {deletingId === product.id ? 'Deleting...' : 'Delete'}
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

