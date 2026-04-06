import type { AuthService } from '../../domain/services'
import type { AuthUser, UserRole } from '../../domain/types'

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

const userRolesByEmail = new Map<string, UserRole>([
  ['admin@furniture.demo', 'admin'],
  ['user@furniture.demo', 'user'],
])

export class MockAuthService implements AuthService {
  private user: AuthUser | null = null

  async signIn(email: string, _password: string) {
    await wait(150)
    const normalizedEmail = email.trim().toLowerCase()
    const role = userRolesByEmail.get(normalizedEmail) ?? 'user'

    this.user = {
      id: normalizedEmail,
      email: normalizedEmail,
      role,
    }

    return this.user
  }

  async signOut() {
    await wait(100)
    this.user = null
  }

  async register(email: string, _password: string) {
    await wait(180)
    const normalizedEmail = email.trim().toLowerCase()

    if (!userRolesByEmail.has(normalizedEmail)) {
      userRolesByEmail.set(normalizedEmail, 'user')
    }

    this.user = {
      id: normalizedEmail,
      email: normalizedEmail,
      role: userRolesByEmail.get(normalizedEmail) ?? 'user',
    }

    return this.user
  }

  async setRole(email: string, role: UserRole) {
    await wait(120)
    const normalizedEmail = email.trim().toLowerCase()
    userRolesByEmail.set(normalizedEmail, role)

    if (this.user?.email === normalizedEmail) {
      this.user = { ...this.user, role }
    }
  }

  async getCurrentUser() {
    await wait(80)
    return this.user
  }
}

