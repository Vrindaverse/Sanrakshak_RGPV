import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageShell } from '../components/layout/PageShell'
import { ArrowUpRight, ShieldMark } from '../components/ui/icons'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  useDocumentTitle('Sign in — Sanrakshak')
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageShell>
      <section className="register" aria-labelledby="login-title">
        <div className="shell register-grid">
          <div className="register-copy">
            <p className="eyebrow">Sign in</p>
            <h1 className="register-title" id="login-title">
              Welcome <em>back.</em>
            </h1>
            <p className="register-lede">
              Access your Sanrakshak dashboard and scan reports.
            </p>

            <ol className="register-steps">
              <li>
                <span>01</span>
                Sign in to your account
              </li>
              <li>
                <span>02</span>
                Manage your security scans
              </li>
              <li>
                <span>03</span>
                Review findings and recommendations
              </li>
            </ol>

            <p className="register-note">
              <ShieldMark /> Secure authentication powered by JWT tokens
            </p>
          </div>

          <div className="register-panel">
            <form className="register-form" onSubmit={onSubmit}>
              <div className="register-form-head">
                <span>Sign in</span>
                <span>01 / 01</span>
              </div>

              {error && (
                <div style={{ color: '#ff4444', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  {error}
                </div>
              )}

              <label className="field">
                <span className="field-label">Email</span>
                <input
                  className="field-input"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@studio.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>

              <label className="field">
                <span className="field-label">Password</span>
                <input
                  className="field-input"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </label>

              <button type="submit" className="btn btn-primary register-submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
                <ArrowUpRight />
              </button>

              <p className="register-form-note">
                Don't have an account? <Link to="/register">Sign up</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
