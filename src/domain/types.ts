export type UserRole = 'user' | 'admin'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
}

export interface ProductCameraPresets {
  front: [number, number, number]
  side: [number, number, number]
  top: [number, number, number]
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  purchaseUrl: string
  modelUrl?: string
  materialHint: string
  dimensions: string
  cameraPresets: ProductCameraPresets
}

