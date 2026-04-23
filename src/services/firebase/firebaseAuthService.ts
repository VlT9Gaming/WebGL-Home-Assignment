import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type Auth,
  type User,
} from 'firebase/auth'
import {
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  type Firestore,
  collection,
} from 'firebase/firestore'
import type { AuthService } from '../../domain/services'
import type { AuthUser, UserRole } from '../../domain/types'

const USERS_COLLECTION = 'users'

interface UserRoleRecord {
  email: string
  role: UserRole
  username?: string
}

const normalizeEmail = (email: string) => email.trim().toLowerCase()

const normalizeRole = (role: UserRoleRecord['role'] | undefined): UserRole => (role === 'admin' ? 'admin' : 'user')

const toUsername = (email: string) => email.split('@')[0] ?? ''

export class FirebaseAuthService implements AuthService {
  private readonly auth: Auth
  private readonly db: Firestore

  constructor(auth: Auth, db: Firestore) {
    this.auth = auth
    this.db = db
  }

  private async getRoleForUser(user: User): Promise<UserRole> {
    const byUidRef = doc(this.db, USERS_COLLECTION, user.uid)
    const byUidSnapshot = await getDoc(byUidRef)
    if (byUidSnapshot.exists()) {
      const data = byUidSnapshot.data() as Partial<UserRoleRecord>
      return normalizeRole(data.role)
    }

    const normalizedEmail = normalizeEmail(user.email ?? '')
    const byEmailSnapshot = await getDocs(
      query(collection(this.db, USERS_COLLECTION), where('email', '==', normalizedEmail)),
    )

    if (!byEmailSnapshot.empty) {
      const first = byEmailSnapshot.docs[0].data() as Partial<UserRoleRecord>
      const role = normalizeRole(first.role)
      await setDoc(
        byUidRef,
        { email: normalizedEmail, role, username: toUsername(normalizedEmail) },
        { merge: true },
      )
      return role
    }

    await setDoc(
      byUidRef,
      { email: normalizedEmail, role: 'user', username: toUsername(normalizedEmail) },
      { merge: true },
    )
    return 'user'
  }

  private async toAuthUser(user: User): Promise<AuthUser> {
    const role = await this.getRoleForUser(user)

    return {
      id: user.uid,
      email: user.email ?? '',
      role,
    }
  }

  async signIn(email: string, password: string) {
    const credential = await signInWithEmailAndPassword(this.auth, normalizeEmail(email), password)
    return this.toAuthUser(credential.user)
  }

  async signOut() {
    await signOut(this.auth)
  }

  async register(email: string, password: string) {
    const normalizedEmail = normalizeEmail(email)
    const credential = await createUserWithEmailAndPassword(this.auth, normalizedEmail, password)

    await setDoc(
      doc(this.db, USERS_COLLECTION, credential.user.uid),
      {
        email: normalizedEmail,
        role: 'user',
        username: toUsername(normalizedEmail),
      } satisfies UserRoleRecord,
      { merge: true },
    )

    return this.toAuthUser(credential.user)
  }

  async setRole(email: string, role: UserRole) {
    const normalizedEmail = normalizeEmail(email)
    const snapshot = await getDocs(
      query(collection(this.db, USERS_COLLECTION), where('email', '==', normalizedEmail)),
    )

    if (!snapshot.empty) {
      await Promise.all(snapshot.docs.map((entry) => updateDoc(entry.ref, { role })))
      return
    }

    const current = this.auth.currentUser
    if (current && normalizeEmail(current.email ?? '') === normalizedEmail) {
      await setDoc(
        doc(this.db, USERS_COLLECTION, current.uid),
        {
          email: normalizedEmail,
          role,
          username: toUsername(normalizedEmail),
        } satisfies UserRoleRecord,
        { merge: true },
      )
    }
  }

  async getCurrentUser() {
    const current = this.auth.currentUser
    if (!current) {
      return null
    }

    return this.toAuthUser(current)
  }
}
