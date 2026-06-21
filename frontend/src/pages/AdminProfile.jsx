import { useState, useRef } from 'react'
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
  const [uploading, setUploading] = useState(false)
  const [avatar, setAvatar] = useState(user?.avatar_url || null)
  const fileRef = useRef(null)

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const { url } = await api.upload(file)
      setAvatar(url)
      await api.users.updateProfile({ avatar_url: url })
      await dispatch(checkAuth())
      setMessage({ type: 'success', text: 'Avatar updated!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setUploading(false)
    }
  }

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
    <div className="animate-fade-slide-in">
      <Helmet><title>Profile | DPE Admin</title></Helmet>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">My Profile</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Manage your account details</p>
      </div>

      <div className="mx-auto max-w-lg">
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row">
            <div className="relative">
              {avatar ? (
                <img src={avatar} alt="" className="size-20 rounded-full object-cover shadow-sm" />
              ) : (
                <div className="flex size-20 items-center justify-center rounded-full bg-[var(--color-primary)] text-2xl font-bold text-white shadow-sm">
                  {user?.full_name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase()}
                </div>
              )}
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full border-2 border-white bg-[var(--color-primary)] text-white shadow-sm transition-colors hover:bg-[var(--color-primary-light)]">
                {uploading ? (
                  <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
                )}
              </button>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleUpload} />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-lg font-bold text-[var(--color-text)]">{user?.full_name || user?.username}</h2>
              <p className="text-sm text-[var(--color-muted)]">@{user?.username}</p>
              <button type="button" onClick={() => fileRef.current?.click()}
                className="mt-2 text-xs font-medium text-[var(--color-primary)] underline underline-offset-2 transition-colors hover:text-[var(--color-primary-light)]">
                {uploading ? 'Uploading...' : 'Change profile photo'}
              </button>
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
