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
      <section className="page stack narrow">
        <h2>You are already signed in</h2>
        <p>Head to catalog or admin tools using the top navigation.</p>
      </section>
    )
  }

  return (
    <section className="page stack narrow">
      <h2>{mode === 'login' ? 'Sign in' : 'Create account'}</h2>
      <p>Use your Firebase Authentication email and password.</p>

      <form onSubmit={handleSubmit} className="stack form-panel">
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
          />
        </label>

        {error ? <p className="error-text">{error}</p> : null}

        <div className="row">
          <button type="submit" disabled={submitting}>
            {submitting ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
          <button
            type="button"
            className="ghost"
            onClick={() => setMode((current) => (current === 'login' ? 'register' : 'login'))}
          >
            {mode === 'login' ? 'Need an account?' : 'Use existing account'}
          </button>
        </div>
      </form>
    </section>
  )
}


