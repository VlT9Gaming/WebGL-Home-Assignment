import type { ProductService } from '../../domain/services'
import type { Product } from '../../domain/types'
import { mockProducts } from './mockData'

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export class MockProductService implements ProductService {
  private products: Product[] = [...mockProducts]

  async listProducts() {
    await wait(150)
    return [...this.products]
  }

  async getProductById(id: string) {
    await wait(120)
    return this.products.find((product) => product.id === id) ?? null
  }

  async createProduct(input: Omit<Product, 'id'>) {
    await wait(180)
    const id = input.name.toLowerCase().replace(/\s+/g, '-')
    const created: Product = { ...input, id }
    this.products = [created, ...this.products]
    return created
  }

  async updateProduct(id: string, updates: Partial<Omit<Product, 'id'>>) {
    await wait(180)
    const index = this.products.findIndex((product) => product.id === id)
    if (index < 0) {
      return null
    }

    const updated = { ...this.products[index], ...updates }
    this.products[index] = updated
    return updated
  }

  async deleteProduct(id: string) {
    await wait(180)
    const before = this.products.length
    this.products = this.products.filter((product) => product.id !== id)
    return this.products.length < before
  }
}

