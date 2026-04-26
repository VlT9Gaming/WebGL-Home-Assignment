import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'

interface LocationState {
  from?: string
}

export function LoginPage() {
  const { signIn, register, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state as LocationState | null) ?? null

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const destination = state?.from ?? '/'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      if (mode === 'login') {
        await signIn(email, password)
      } else {
        await register(email, password)
      }
      navigate(destination, { replace: true })
    } catch {
      setError('Unable to authenticate. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (user) {
    return (
      <section className="page stack narrow bg-white/90">
        <h2 className="text-2xl font-semibold text-slate-900">You are already signed in</h2>
        <p className="text-slate-600">Head to catalog or admin tools using the top navigation.</p>
      </section>
    )
  }

  return (
    <section className="page stack narrow bg-linear-to-b from-white to-slate-50 py-2">
      <div className="section-hero">
        <span className="stat-pill">Secure account access</span>
        <h2 className="text-2xl font-semibold text-slate-900">{mode === 'login' ? 'Sign in' : 'Create account'}</h2>
        <p className="mt-1 text-slate-600">Use your Firebase Authentication email and password.</p>
      </div>

      <form onSubmit={handleSubmit} className="stack form-panel border-slate-200 bg-white shadow-sm">
        <label className="text-sm font-medium text-slate-700">
          Email
          <input
            className="mt-1 bg-white"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Password
          <input
            className="mt-1 bg-white"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
          />
        </label>

        {error ? <p className="error-text">{error}</p> : null}

        <div className="row gap-2">
          <button
            type="submit"
            className="btn-primary w-full sm:w-auto"
            disabled={submitting}
          >
            {submitting ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
          <button
            type="button"
            className="btn-secondary w-full sm:w-auto"
            onClick={() => setMode((current) => (current === 'login' ? 'register' : 'login'))}
          >
            {mode === 'login' ? 'Need an account?' : 'Use existing account'}
          </button>
        </div>
      </form>
    </section>
  )
}


