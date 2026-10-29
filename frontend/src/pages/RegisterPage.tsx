import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageShell } from '../components/layout/PageShell'
import { ArrowUpRight, ShieldMark } from '../components/ui/icons'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { useAuth } from '../context/AuthContext'

export function RegisterPage() {
  useDocumentTitle('Sign up — Sanrakshak')
  const navigate = useNavigate()
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      await register(name, email, password)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageShell>
      <section className="register" aria-labelledby="register-title">
        <div className="shell register-grid">
          <div className="register-copy">
            <p className="eyebrow">Create account</p>
            <h1 className="register-title" id="register-title">
              Get <em>started.</em>
            </h1>
            <p className="register-lede">
              Create your Sanrakshak account to access security scanning.
            </p>

            <ol className="register-steps">
              <li>
                <span>01</span>
                Create your account
              </li>
              <li>
                <span>02</span>
                Request security scans
              </li>
              <li>
                <span>03</span>
                Get detailed vulnerability reports
              </li>
            </ol>

            <p className="register-note">
              <ShieldMark /> Secure authentication with encrypted passwords
            </p>
          </div>

          <div className="register-panel">
            <form className="register-form" onSubmit={onSubmit}>
              <div className="register-form-head">
                <span>Sign up</span>
                <span>01 / 01</span>
              </div>

              {error && (
                <div style={{ color: '#ff4444', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  {error}
                </div>
              )}

              <label className="field">
                <span className="field-label">Full Name</span>
                <input
                  className="field-input"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </label>

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
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </label>

              <label className="field">
                <span className="field-label">Confirm Password</span>
                <input
                  className="field-input"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
              </label>

              <button type="submit" className="btn btn-primary register-submit" disabled={loading}>
                {loading ? 'Creating account...' : 'Sign up'}
                <ArrowUpRight />
              </button>

              <p className="register-form-note">
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
