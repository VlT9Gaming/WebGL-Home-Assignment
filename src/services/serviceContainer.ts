import type { AuthService, ProductService } from '../domain/services'
import { firebaseAuth, firestoreDb } from '../firebase-config'
import { FirebaseAuthService } from './firebase/firebaseAuthService'
import { FirebaseProductService } from './firebase/firebaseProductService'

const createServices = (): { auth: AuthService; products: ProductService } => {
  return {
    auth: new FirebaseAuthService(firebaseAuth, firestoreDb),
    products: new FirebaseProductService(firestoreDb),
  }
}


export const services: {
  auth: AuthService
  products: ProductService
} = createServices()

