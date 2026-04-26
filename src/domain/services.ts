import type { AuthUser, Product, UserPreferences, UserRole } from './types'

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

export interface PreferencesService {
  listFavoriteProductIds(userId: string): Promise<string[]>
  toggleFavorite(userId: string, productId: string): Promise<boolean>
  isFavorite(userId: string, productId: string): Promise<boolean>
  getPreferences(userId: string): Promise<UserPreferences>
  updatePreferences(userId: string, updates: Partial<UserPreferences>): Promise<UserPreferences>
}

