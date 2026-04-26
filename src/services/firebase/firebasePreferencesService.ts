import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  type Firestore,
} from 'firebase/firestore'
import type { PreferencesService } from '../../domain/services'
import type { UserPreferences } from '../../domain/types'

const USERS_COLLECTION = 'users'
const FAVORITES_COLLECTION = 'favorites'
const PREFERENCES_COLLECTION = 'preferences'
const DEFAULT_PREFERENCES_DOC = 'default'

interface PreferencesDoc {
  viewerAutoRotate?: boolean
}

const defaultPreferences: UserPreferences = {
  viewerAutoRotate: false,
}

const toPreferences = (raw: unknown): UserPreferences => {
  const data = (raw ?? {}) as PreferencesDoc
  return {
    viewerAutoRotate: data.viewerAutoRotate === true,
  }
}

export class FirebasePreferencesService implements PreferencesService {
  private readonly db: Firestore

  constructor(db: Firestore) {
    this.db = db
  }

  async listFavoriteProductIds(userId: string) {
    const snapshot = await getDocs(collection(this.db, USERS_COLLECTION, userId, FAVORITES_COLLECTION))
    return snapshot.docs.map((entry) => entry.id)
  }

  async toggleFavorite(userId: string, productId: string) {
    const favoriteRef = doc(this.db, USERS_COLLECTION, userId, FAVORITES_COLLECTION, productId)
    const existing = await getDoc(favoriteRef)

    if (existing.exists()) {
      await deleteDoc(favoriteRef)
      return false
    }

    await setDoc(favoriteRef, { productId }, { merge: true })
    return true
  }

  async isFavorite(userId: string, productId: string) {
    const favoriteRef = doc(this.db, USERS_COLLECTION, userId, FAVORITES_COLLECTION, productId)
    const existing = await getDoc(favoriteRef)
    return existing.exists()
  }

  async getPreferences(userId: string) {
    const preferencesRef = doc(
      this.db,
      USERS_COLLECTION,
      userId,
      PREFERENCES_COLLECTION,
      DEFAULT_PREFERENCES_DOC,
    )
    const snapshot = await getDoc(preferencesRef)
    if (!snapshot.exists()) {
      return defaultPreferences
    }

    return toPreferences(snapshot.data())
  }

  async updatePreferences(userId: string, updates: Partial<UserPreferences>) {
    const preferencesRef = doc(
      this.db,
      USERS_COLLECTION,
      userId,
      PREFERENCES_COLLECTION,
      DEFAULT_PREFERENCES_DOC,
    )

    const current = await this.getPreferences(userId)
    const next = {
      ...current,
      ...updates,
    }

    await setDoc(preferencesRef, next, { merge: true })
    return next
  }
}

