import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  type Firestore,
  updateDoc,
} from 'firebase/firestore'
import type { ProductService } from '../../domain/services'
import type { DiscountType, Product, ProductCameraPresets } from '../../domain/types'

const PRODUCTS_COLLECTION = 'products'

interface ProductDoc {
  product_name?: string
  name?: string
  description?: string
  price?: number
  discountType?: DiscountType
  discountValue?: number
  imageUrl?: string
  purchaseUrl?: string
  modelUrl?: string
  materialHint?: string
  dimensions?: string
  cameraPresets?: Partial<ProductCameraPresets>
}

const defaultCameraPresets: ProductCameraPresets = {
  front: [4, 2.2, 4],
  side: [5.5, 2, 0],
  top: [0.2, 6, 0.2],
}

const asDiscountType = (value: unknown): DiscountType => {
  if (value === 'percent' || value === 'fixed') {
    return value
  }
  return 'none'
}

const asTuple = (value: unknown, fallback: [number, number, number]): [number, number, number] => {
  if (!Array.isArray(value) || value.length !== 3) {
    return fallback
  }

  const numbers = value.map((entry) => Number(entry))
  if (numbers.some((entry) => Number.isNaN(entry))) {
    return fallback
  }

  return [numbers[0], numbers[1], numbers[2]]
}

const mapDocToProduct = (id: string, raw: unknown): Product => {
  const data = (raw ?? {}) as ProductDoc
  const cameraPresets = (data.cameraPresets ?? {}) as Partial<ProductCameraPresets>

  return {
    id,
    name: String(data.product_name ?? data.name ?? ''),
    description: String(data.description ?? ''),
    price: Number(data.price ?? 0),
    discountType: asDiscountType(data.discountType),
    discountValue: Number(data.discountValue ?? 0),
    imageUrl: String(data.imageUrl ?? ''),
    purchaseUrl: String(data.purchaseUrl ?? ''),
    modelUrl: data.modelUrl ? String(data.modelUrl) : '',
    materialHint: String(data.materialHint ?? ''),
    dimensions: String(data.dimensions ?? ''),
    cameraPresets: {
      front: asTuple(cameraPresets.front, defaultCameraPresets.front),
      side: asTuple(cameraPresets.side, defaultCameraPresets.side),
      top: asTuple(cameraPresets.top, defaultCameraPresets.top),
    },
  }
}

const mapProductInputToDoc = (input: Omit<Product, 'id'>): ProductDoc => ({
  product_name: input.name,
  description: input.description,
  price: input.price,
  discountType: input.discountType,
  discountValue: input.discountValue,
  imageUrl: input.imageUrl,
  purchaseUrl: input.purchaseUrl,
  modelUrl: input.modelUrl ?? '',
  materialHint: input.materialHint,
  dimensions: input.dimensions,
  cameraPresets: input.cameraPresets,
})

const mapProductUpdatesToDoc = (updates: Partial<Omit<Product, 'id'>>): Partial<ProductDoc> => {
  const nextUpdates: Partial<ProductDoc> = { ...updates }
  if (typeof updates.name !== 'undefined') {
    nextUpdates.product_name = updates.name
    delete (nextUpdates as Record<string, unknown>).name
  }
  return nextUpdates
}

export class FirebaseProductService implements ProductService {
  private readonly db: Firestore

  constructor(db: Firestore) {
    this.db = db
  }

  async listProducts() {
    const snapshot = await getDocs(collection(this.db, PRODUCTS_COLLECTION))
    return snapshot.docs.map((docSnapshot) => mapDocToProduct(docSnapshot.id, docSnapshot.data()))
  }

  async getProductById(id: string) {
    const snapshot = await getDoc(doc(this.db, PRODUCTS_COLLECTION, id))
    if (!snapshot.exists()) {
      return null
    }

    return mapDocToProduct(snapshot.id, snapshot.data())
  }

  async createProduct(input: Omit<Product, 'id'>) {
    const collectionRef = collection(this.db, PRODUCTS_COLLECTION)
    const createdRef = await addDoc(collectionRef, mapProductInputToDoc(input))
    return {
      ...input,
      id: createdRef.id,
    }
  }

  async updateProduct(id: string, updates: Partial<Omit<Product, 'id'>>) {
    const docRef = doc(this.db, PRODUCTS_COLLECTION, id)
    const existing = await getDoc(docRef)

    if (!existing.exists()) {
      return null
    }

    await updateDoc(docRef, mapProductUpdatesToDoc(updates))
    const updated = await getDoc(docRef)
    return updated.exists() ? mapDocToProduct(updated.id, updated.data()) : null
  }

  async deleteProduct(id: string) {
    const docRef = doc(this.db, PRODUCTS_COLLECTION, id)
    const existing = await getDoc(docRef)
    if (!existing.exists()) {
      return false
    }

    await deleteDoc(docRef)
    return true
  }
}


