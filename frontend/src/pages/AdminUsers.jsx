import { useState, useEffect, useRef, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { api } from '../services/api'
import Pagination from '../components/Pagination'
import ConfirmModal from '../components/ConfirmModal'

const PAGE_SIZE = 10
const FRONTEND_URL = 'https://dpe-engine-solutions.vercel.app'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ username: '', password: '', email: '', full_name: '' })
  const [page, setPage] = useState(1)
  const [credentials, setCredentials] = useState(null)
  const [copied, setCopied] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const textRef = useRef(null)

  const loadUsers = async () => {
    try {
      const data = await api.users.list()
      setUsers(data.users)
    } catch { } finally { setLoading(false) }
  }

  useEffect(() => { loadUsers() }, [])

  const totalPages = Math.ceil(users.length / PAGE_SIZE)
  const pagedUsers = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const openCreate = () => {
    setEditing(null)
    setForm({ username: '', password: '', email: '', full_name: '' })
    setShowForm(true)
  }

  const openEdit = (u) => {
    setEditing(u.id)
    setForm({ username: u.username, password: '', email: u.email || '', full_name: u.full_name || '' })
    setShowForm(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        const body = { username: form.username, email: form.email, full_name: form.full_name }
        if (form.password) body.password = form.password
        await api.users.update(editing, body)
        setShowForm(false)
        loadUsers()
      } else {
        const { user } = await api.users.create(form)
        setShowForm(false)
        loadUsers()
        setCredentials({ ...user, password: form.password })
      }
    } catch (err) { alert(err.message) }
    finally { setSaving(false) }
  }

  const emailText = useCallback(() => {
    if (!credentials) return ''
    return [
      `Subject: Your DPE Admin Account Credentials`,
      ``,
      `Hello ${credentials.full_name || credentials.username},`,
      ``,
      `Your admin account for DPE Engine Solutions has been created.`,
      ``,
      `Login URL: ${FRONTEND_URL}/admin/login`,
      `Username: ${credentials.username}`,
      `Password: ${credentials.password}`,
      ``,
      `After logging in, you can update your profile (name, email, password) from the Profile page.`,
      ``,
      `Regards,`,
      `DPE Admin`,
    ].join('\n')
  }, [credentials])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textRef.current?.textContent || emailText())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try { await api.users.delete(deleteTarget); setDeleteTarget(null); loadUsers() }
    catch { }
    finally { setDeleting(false) }
  }

  return (
    <div className="animate-fade-slide-in">
      <Helmet><title>Users | DPE Admin</title></Helmet>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Users</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">{users.length} admin users</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--color-primary-light)] hover:shadow-md">+ Add User</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="size-8 animate-spin rounded-full border-3 border-[var(--color-border)] border-t-[var(--color-primary)]" /></div>
      ) : users.length === 0 ? (
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-12 text-center">
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-[var(--color-bg)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <p className="text-sm font-medium text-[var(--color-muted)]">No users yet</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)] text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Username</th>
                <th className="px-5 py-3.5">Email</th>
                <th className="px-5 py-3.5">Joined</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {pagedUsers.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-[var(--color-bg)]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-xs font-bold text-[var(--color-primary)]">{u.full_name?.[0]?.toUpperCase() || u.username[0].toUpperCase()}</div>
                      <span className="font-medium text-[var(--color-text)]">{u.full_name || u.username}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[var(--color-muted)]">{u.username}</td>
                  <td className="px-5 py-4 text-[var(--color-muted)]">{u.email || '—'}</td>
                  <td className="px-5 py-4 text-[var(--color-muted)]">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(u)} className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-[11px] font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-bg)]">Edit</button>
                      <button onClick={() => setDeleteTarget(u.id)} disabled={loading} className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-[11px] font-medium text-[var(--color-error)] transition-colors hover:bg-[var(--color-error)]/10 disabled:opacity-50">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t border-[var(--color-border)] px-5 py-3">
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {showForm && !editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 animate-fade-in" onClick={() => { setShowForm(false); setCredentials(null) }}>
          <div className="w-full max-w-md rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-4 text-base font-bold text-[var(--color-text)]">Add User</h2>
            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Full Name</label>
                <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm outline-none transition-all focus:border-[var(--color-primary)] focus:bg-white" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Username *</label>
                <input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm outline-none transition-all focus:border-[var(--color-primary)] focus:bg-white" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm outline-none transition-all focus:border-[var(--color-primary)] focus:bg-white" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Password *</label>
                <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm outline-none transition-all focus:border-[var(--color-primary)] focus:bg-white" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-bg)]">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--color-primary-light)] disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showForm && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 animate-fade-in" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-md rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-4 text-base font-bold text-[var(--color-text)]">Edit User</h2>
            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Full Name</label>
                <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm outline-none transition-all focus:border-[var(--color-primary)] focus:bg-white" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Username *</label>
                <input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm outline-none transition-all focus:border-[var(--color-primary)] focus:bg-white" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm outline-none transition-all focus:border-[var(--color-primary)] focus:bg-white" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">New Password (leave blank to keep)</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm outline-none transition-all focus:border-[var(--color-primary)] focus:bg-white" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-bg)]">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--color-primary-light)] disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {credentials && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 animate-fade-in" onClick={() => setCredentials(null)}>
          <div className="w-full max-w-lg rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-[var(--color-text)]">User Created — Send Credentials</h2>
              <button onClick={() => setCredentials(null)} className="rounded-lg p-1.5 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-bg)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <p className="mb-3 text-sm text-[var(--color-muted)]">Copy this email text and send it to the user via Gmail.</p>
            <div ref={textRef} className="mb-4 whitespace-pre-wrap rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4 font-mono text-xs leading-relaxed text-[var(--color-text)]">
              {emailText()}
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setCredentials(null)} className="rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-bg)]">Close</button>
              <button onClick={handleCopy} className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--color-primary-light)]">
                {copied ? 'Copied!' : 'Copy Email'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
