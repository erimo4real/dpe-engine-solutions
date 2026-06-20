import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { api } from '../services/api'
import { checkAuth } from '../features/auth/authSlice'

export default function AdminProfile() {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const [form, setForm] = useState({ full_name: user?.full_name || '', email: user?.email || '' })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      await api.users.updateProfile(form)
      await dispatch(checkAuth())
      setMessage({ type: 'success', text: 'Profile updated!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <Helmet><title>Profile | DPE Admin</title></Helmet>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">My Profile</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Manage your account details</p>
      </div>

      <div className="mx-auto max-w-lg">
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-[var(--color-primary)] text-xl font-bold text-white shadow-sm">{user?.full_name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase()}</div>
            <div>
              <h2 className="text-lg font-bold text-[var(--color-text)]">{user?.full_name || user?.username}</h2>
              <p className="text-sm text-[var(--color-muted)]">@{user?.username}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Full Name</label>
              <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm outline-none transition-all focus:border-[var(--color-primary)] focus:bg-white" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm outline-none transition-all focus:border-[var(--color-primary)] focus:bg-white" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Username</label>
              <input value={user?.username || ''} disabled
                className="w-full cursor-not-allowed rounded-lg border border-[var(--color-border)] bg-gray-100 px-3 py-2.5 text-sm text-[var(--color-muted)] outline-none" />
              <p className="mt-1 text-xs text-[var(--color-muted)]">Username cannot be changed.</p>
            </div>

            {message && (
              <div className={`rounded-lg px-4 py-3 text-sm font-medium ${message.type === 'success' ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' : 'bg-[var(--color-error)]/10 text-[var(--color-error)]'}`}>
                {message.text}
              </div>
            )}

            <button type="submit" disabled={saving}
              className="w-full rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--color-primary-light)] disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
