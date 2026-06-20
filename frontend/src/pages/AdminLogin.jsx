import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login, clearError } from '../features/auth/authSlice'
import { Navigate, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { api } from '../services/api'

const Icon = ({ d, className = 'text-[var(--color-muted)]' }) => (
  <svg className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${className}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: d }} />
)

function InputField({ id, label, icon, type = 'text', value, onChange, placeholder, autoComplete }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-[var(--color-muted)]">{label}</label>
      <div className="relative">
        <Icon d={icon} />
        <input id={id} type={type} required value={value} onChange={onChange} placeholder={placeholder} autoComplete={autoComplete}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] pl-9 pr-4 py-2.5 text-sm outline-none transition-all focus:border-[var(--color-primary)] focus:bg-white focus:shadow-sm hover:border-[var(--color-border)]" />
      </div>
    </div>
  )
}

function PasswordField({ id, label, icon, value, onChange, autoComplete }) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-[var(--color-muted)]">{label}</label>
      <div className="relative">
        <Icon d={icon} />
        <input id={id} type={show ? 'text' : 'password'} required value={value} onChange={onChange} autoComplete={autoComplete}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] pl-9 pr-9 py-2.5 text-sm outline-none transition-all focus:border-[var(--color-primary)] focus:bg-white focus:shadow-sm hover:border-[var(--color-border)]" />
        <button type="button" tabIndex={-1} onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-muted)] transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {show ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function AdminLogin() {
  const dispatch = useDispatch()
  const { user, loading, error } = useSelector((s) => s.auth)
  const [searchParams] = useSearchParams()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('login')
  const [fpUsername, setFpUsername] = useState('')
  const [fpSent, setFpSent] = useState(false)
  const [fpSending, setFpSending] = useState(false)
  const [fpError, setFpError] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [resetPassword, setResetPassword] = useState('')
  const [resetConfirm, setResetConfirm] = useState('')
  const [resetSaving, setResetSaving] = useState(false)
  const [resetError, setResetError] = useState('')
  const [resetDone, setResetDone] = useState(false)

  const redirect = searchParams.get('redirect') || '/admin/dashboard'

  if (user) return <Navigate to={redirect} replace />

  const handleLogin = (e) => {
    e.preventDefault()
    dispatch(clearError())
    dispatch(login({ username, password }))
  }

  const handleForgotSubmit = async (e) => {
    e.preventDefault()
    setFpSending(true)
    setFpError('')
    try {
      await api.auth.forgotPassword({ username: fpUsername })
      setFpSent(true)
    } catch (err) {
      setFpError(err.message)
    } finally {
      setFpSending(false)
    }
  }

  const handleResetSubmit = async (e) => {
    e.preventDefault()
    if (resetPassword.length < 6) { setResetError('Password must be at least 6 characters'); return }
    if (resetPassword !== resetConfirm) { setResetError('Passwords do not match'); return }
    setResetSaving(true)
    setResetError('')
    try {
      await api.auth.resetPassword({ token: resetToken, newPassword: resetPassword })
      setResetDone(true)
    } catch (err) {
      setResetError(err.message)
    } finally {
      setResetSaving(false)
    }
  }

  return (
    <>
      <Helmet><title>Admin Login | DPE Engine Solutions</title></Helmet>
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-2xl font-bold text-white shadow-lg">D</div>
            {mode === 'login' && <><h1 className="text-xl font-bold text-[var(--color-text)]">Welcome Back</h1><p className="mt-1 text-sm text-[var(--color-muted)]">Sign in to DPE Engine Solutions admin</p></>}
            {mode === 'forgot' && <><h1 className="text-xl font-bold text-[var(--color-text)]">Forgot Password</h1><p className="mt-1 text-sm text-[var(--color-muted)]">Enter your username to receive a reset code</p></>}
            {mode === 'reset' && <><h1 className="text-xl font-bold text-[var(--color-text)]">Reset Password</h1><p className="mt-1 text-sm text-[var(--color-muted)]">Enter the reset code and your new password</p></>}
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <InputField id="username" label="Username" icon="<path d='M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2'/><circle cx='12' cy='7' r='4'/>" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
                <PasswordField id="password" label="Password" icon="<rect x='3' y='11' width='18' height='11' rx='2' ry='2'/><path d='M7 11V7a5 5 0 0110 0v4'/>" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
                {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[var(--color-error)]">{error}</p>}
                <button type="submit" disabled={loading}
                  className="w-full rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:shadow-md disabled:opacity-50">
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
                <button type="button" onClick={() => { setMode('forgot'); setFpUsername(username); setFpSent(false); setFpError('') }}
                  className="w-full text-center text-xs text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary)]">Forgot Password?</button>
              </form>
            )}

            {mode === 'forgot' && (
              fpSent ? (
                <div className="text-center">
                  <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-emerald-50">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                  </div>
                  <p className="text-sm font-medium text-[var(--color-text)]">Reset code sent!</p>
                  <p className="mt-1 text-xs text-[var(--color-muted)]">Check the server console for the reset code (or contact your admin).</p>
                  <button onClick={() => setMode('reset')} className="mt-4 w-full rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:shadow-md">Enter Reset Code</button>
                  <button onClick={() => setMode('login')} className="mt-2 w-full text-center text-xs text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary)]">Back to Login</button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <InputField id="fp-username" label="Username" icon="<path d='M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2'/><circle cx='12' cy='7' r='4'/>" value={fpUsername} onChange={(e) => setFpUsername(e.target.value)} />
                  {fpError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[var(--color-error)]">{fpError}</p>}
                  <button type="submit" disabled={fpSending}
                    className="w-full rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:shadow-md disabled:opacity-50">
                    {fpSending ? 'Sending...' : 'Send Reset Code'}
                  </button>
                  <button type="button" onClick={() => setMode('login')} className="w-full text-center text-xs text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary)]">Back to Login</button>
                </form>
              )
            )}

            {mode === 'reset' && (
              resetDone ? (
                <div className="text-center">
                  <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-emerald-50">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                  </div>
                  <p className="text-sm font-medium text-[var(--color-text)]">Password reset successful!</p>
                  <p className="mt-1 text-xs text-[var(--color-muted)]">You can now login with your new password.</p>
                  <button onClick={() => { setMode('login'); setResetDone(false) }} className="mt-4 w-full rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:shadow-md">Back to Login</button>
                </div>
              ) : (
                <form onSubmit={handleResetSubmit} className="space-y-4">
                  <InputField id="reset-token" label="Reset Code" icon="<path d='M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4'/>" value={resetToken} onChange={(e) => setResetToken(e.target.value.toUpperCase())} placeholder="e.g. A3F8K2" />
                  <PasswordField id="reset-pw" label="New Password" icon="<rect x='3' y='11' width='18' height='11' rx='2' ry='2'/><path d='M7 11V7a5 5 0 0110 0v4'/>" value={resetPassword} onChange={(e) => setResetPassword(e.target.value)} />
                  <PasswordField id="reset-confirm" label="Confirm New Password" icon="<path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'/>" value={resetConfirm} onChange={(e) => setResetConfirm(e.target.value)} />
                  {resetError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[var(--color-error)]">{resetError}</p>}
                  <button type="submit" disabled={resetSaving}
                    className="w-full rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:shadow-md disabled:opacity-50">
                    {resetSaving ? 'Resetting...' : 'Reset Password'}
                  </button>
                  <button type="button" onClick={() => setMode('login')} className="w-full text-center text-xs text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary)]">Back to Login</button>
                </form>
              )
            )}
          </div>
        </div>
      </div>
    </>
  )
}
