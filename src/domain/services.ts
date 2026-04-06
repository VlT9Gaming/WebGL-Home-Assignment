import type { AuthUser, Product, UserRole } from './types'

export interface ProductService {
  listProducts(): Promise<Product[]>
  getProductById(id: string): Promise<Product | null>
  createProduct(input: Omit<Product, 'id'>): Promise<Product>
  updateProduct(id: string, updates: Partial<Omit<Product, 'id'>>): Promise<Product | null>
  deleteProduct(id: string): Promise<boolean>
}

export interface AuthService {
  signIn(email: string, password: string): Promise<AuthUser>
  signOut(): Promise<void>
  register(email: string, password: string): Promise<AuthUser>
  setRole(email: string, role: UserRole): Promise<void>
  getCurrentUser(): Promise<AuthUser | null>
}

