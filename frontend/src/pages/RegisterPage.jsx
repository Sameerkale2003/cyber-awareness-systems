import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'

// ──────── Password strength checker ────────
function PasswordStrengthMeter({ password }) {
  const checks = {
    length:  password.length >= 8,
    upper:   /[A-Z]/.test(password),
    lower:   /[a-z]/.test(password),
    number:  /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }
  const score = Object.values(checks).filter(Boolean).length
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
  const colors = ['', '#e74c3c', '#f39c12', '#3498db', '#2ecc71', '#00d4aa']
  if (!password) return null
  return (
    <div className="mt-2">
      <div className="d-flex gap-1 mb-1">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="flex-fill rounded" style={{
            height: 4,
            background: i <= score ? colors[score] : 'rgba(255,255,255,0.1)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
      <div style={{ fontSize: '0.75rem', color: colors[score] }}>{labels[score]}</div>
      <div className="mt-1 d-flex flex-wrap gap-2">
        {[
          [checks.length,  '8+ chars'],
          [checks.upper,   'A-Z'],
          [checks.lower,   'a-z'],
          [checks.number,  '0-9'],
          [checks.special, '!@#'],
        ].map(([ok, label]) => (
          <span key={label} style={{ fontSize: '0.7rem', color: ok ? '#00d4aa' : '#94a3b8' }}>
            {ok ? '✓' : '○'} {label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    first_name: '', last_name: '', username: '', email: '', password: '', password2: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = e => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    setErrors(p => ({ ...p, [name]: '' }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (form.password !== form.password2) {
      setErrors({ password2: 'Passwords do not match' })
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    setErrors({})
    try {
      await api.post('/auth/register/', form)
      toast.success('Registration successful! Please log in with your credentials.')
      navigate('/login')
    } catch (err) {
      const data = err.response?.data || {}
      setErrors(data)
      const firstErr = Object.values(data).flat()[0] || 'Registration failed'
      toast.error(typeof firstErr === 'string' ? firstErr : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page cyber-grid-bg">
      <div className="auth-card mx-3">
        {/* Header */}
        <div className="text-center mb-4">
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🛡️</div>
          <h1 className="font-orbitron text-white" style={{ fontSize: '1.3rem' }}>
            Join <span className="text-cyber-highlight">CyberAware</span>
          </h1>
          <p className="text-cyber-muted mt-1" style={{ fontSize: '0.85rem' }}>
            Start your cyber security journey today
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-2 mb-1">
            <div className="col-6">
              <label className="cyber-label">First Name</label>
              <input type="text" name="first_name" value={form.first_name}
                onChange={handleChange} placeholder="John" required
                className="form-control cyber-input" />
            </div>
            <div className="col-6">
              <label className="cyber-label">Last Name</label>
              <input type="text" name="last_name" value={form.last_name}
                onChange={handleChange} placeholder="Doe"
                className="form-control cyber-input" />
            </div>
          </div>

          <div className="mb-3">
            <label className="cyber-label">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="johndoe"
              required
              className={`form-control cyber-input ${errors.username ? 'border-danger' : ''}`}
            />
            {errors.username && <div className="text-danger mt-1" style={{ fontSize: '0.78rem' }}>{errors.username}</div>}
          </div>

          <div className="mb-3">
            <label className="cyber-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
              className={`form-control cyber-input ${errors.email ? 'border-danger' : ''}`}
            />
            {errors.email && <div className="text-danger mt-1" style={{ fontSize: '0.78rem' }}>{errors.email}</div>}
          </div>

          {/* Password with strength meter */}
          <div className="mb-3">
            <label className="cyber-label">Password</label>
            <div className="position-relative">
              <input type={showPwd ? 'text' : 'password'} name="password"
                value={form.password} onChange={handleChange}
                placeholder="Create a strong password" required
                className={`form-control cyber-input pe-5 ${errors.password ? 'border-danger' : ''}`}
              />
              <button type="button" onClick={() => setShowPwd(p => !p)}
                className="btn border-0 position-absolute top-50 end-0 translate-middle-y me-2 p-0 text-cyber-muted">
                <i className={`bi bi-eye${showPwd ? '-slash' : ''}`} />
              </button>
            </div>
            <PasswordStrengthMeter password={form.password} />
            {errors.password && <div className="text-danger mt-1" style={{ fontSize: '0.78rem' }}>{errors.password}</div>}
          </div>

          <div className="mb-4">
            <label className="cyber-label">Confirm Password</label>
            <input type="password" name="password2" value={form.password2}
              onChange={handleChange} placeholder="Repeat your password" required
              className={`form-control cyber-input ${errors.password2 ? 'border-danger' : ''}`} />
            {errors.password2 && <div className="text-danger mt-1" style={{ fontSize: '0.78rem' }}>{errors.password2}</div>}
          </div>

          <button type="submit" disabled={loading} className="w-100 btn-cyber py-2 rounded-3 fw-bold"
            style={{ fontSize: '1rem', letterSpacing: '0.5px' }}>
            {loading
              ? <><span className="spinner-border spinner-border-sm me-2" />Creating Account...</>
              : '🚀 Create Account'}
          </button>
        </form>

        <div className="text-center mt-3">
          <span className="text-cyber-muted" style={{ fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <Link to="/login" className="text-cyber-highlight fw-semibold">Sign In</Link>
          </span>
        </div>
      </div>
    </div>
  )
}
