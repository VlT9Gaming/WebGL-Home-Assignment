import type { AuthService, ProductService } from '../domain/services'
import { MockAuthService } from './mock/mockAuthService'
import { MockProductService } from './mock/mockProductService'

// Centralized service container keeps UI independent from backend provider details.
export const services: {
  auth: AuthService
  products: ProductService
} = {
  auth: new MockAuthService(),
  products: new MockProductService(),
}

