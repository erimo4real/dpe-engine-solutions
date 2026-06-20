import { useState, useEffect, useRef, useCallback } from 'react'
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import { fetchInquiries, updateInquiryStatus } from '../features/inquiries/inquiriesSlice'
import { api } from '../services/api'

function PasswordField({ label, value, onChange }) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">{label}</label>
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-muted)]" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        <input type={show ? 'text' : 'password'} required value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] pl-9 pr-9 py-2 text-sm outline-none transition-all focus:border-[var(--color-primary)] focus:bg-white hover:border-[var(--color-border)]" />
        <button type="button" tabIndex={-1} onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-muted)] transition-colors">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {show ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
          </svg>
        </button>
      </div>
    </div>
  )
}

const links = [
  { to: '/admin', label: 'Dashboard', end: true, icon: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><polyline points="9 22 9 12 15 12 15 22"/>' },
  { to: '/admin/products', label: 'Products', icon: '<path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>' },
  { to: '/admin/categories', label: 'Categories', icon: '<path d="M4 6h16M4 12h16M4 18h16"/>' },
  { to: '/admin/inquiries', label: 'Inquiries', icon: '<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>' },
  { to: '/admin/users', label: 'Users', icon: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>' },
]

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

export default function AdminLayout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((s) => s.auth)
  const { items: inquiries } = useSelector((s) => s.inquiries)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [toast, setToast] = useState(null)
  const notifRef = useRef(null)
  const prevNewCount = useRef(0)

  const needsAttention = inquiries.filter((i) => i.status === 'new' || i.status === 'read')
  const newCount = needsAttention.length
  const recentNotifications = needsAttention.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5)

  useEffect(() => {
    dispatch(fetchInquiries())
    const interval = setInterval(() => dispatch(fetchInquiries()), 60000)
    return () => clearInterval(interval)
  }, [dispatch])

  useEffect(() => {
    if (!prevNewCount.current) { prevNewCount.current = newCount; return }
    if (newCount > prevNewCount.current) {
      const diff = newCount - prevNewCount.current
      setToast({ message: `${diff} new inquiry${diff > 1 ? 'ies' : ''} received`, time: Date.now() })
      setTimeout(() => setToast(null), 5000)
    }
    prevNewCount.current = newCount
  }, [newCount])

  useEffect(() => {
    document.title = newCount > 0 ? `(${newCount}) DPE Admin` : 'DPE Admin'
  }, [newCount])

  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleNotifyClick = useCallback((inq) => {
    setSelectedInquiry(inq)
    setNotifOpen(false)
  }, [])

  const handleMarkRead = useCallback(async (inq) => {
    if (inq.status === 'new' || inq.status === 'read') {
      await dispatch(updateInquiryStatus({ id: inq.id, status: inq.status === 'new' ? 'read' : 'replied' }))
    }
  }, [dispatch])

  const handleLogout = async () => {
    await dispatch(logout())
    navigate('/admin/login')
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPassError('')
    setPassSuccess(false)
    if (passForm.newPassword.length < 6) { setPassError('New password must be at least 6 characters'); return }
    if (passForm.newPassword !== passForm.confirmPassword) { setPassError('Passwords do not match'); return }
    setPassSaving(true)
    try {
      await api.auth.changePassword({ currentPassword: passForm.currentPassword, newPassword: passForm.newPassword })
      setPassSuccess(true)
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setShowPasswordModal(false), 1500)
    } catch (err) {
      setPassError(err.message)
    } finally {
      setPassSaving(false)
    }
  }

  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [passError, setPassError] = useState('')
  const [passSuccess, setPassSuccess] = useState(false)
  const [passSaving, setPassSaving] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-slide-in rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17H2a3 3 0 003-3V9a7 7 0 0114 0v5a3 3 0 003 3zm-8.27 4a2 2 0 01-3.46 0"/></svg>
            </div>
            <p className="text-sm font-medium text-[var(--color-text)]">{toast.message}</p>
            <button onClick={() => setToast(null)} className="ml-2 text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      )}

      <aside className={`flex flex-col border-r border-[var(--color-border)] bg-white transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-[var(--color-primary)] text-sm font-bold text-white shadow-sm">{user?.full_name?.[0]?.toUpperCase() || 'D'}</div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="text-sm font-bold text-[var(--color-primary)]">DPE Admin</h1>
                  <p className="text-[10px] text-[var(--color-muted)]">Engine Solutions</p>
                </div>
              )}
          </div>
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="flex size-7 items-center justify-center rounded-lg text-[var(--color-muted)] transition-colors hover:bg-[var(--color-bg)] hover:text-[var(--color-text)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {sidebarCollapsed ? <path d="M13 17l5-5-5-5" /> : <path d="M11 17l-5-5 5-5" />}
            </svg>
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 p-3 pt-4">
          {links.map((l) => (
            <div key={l.to} className="relative">
              {l.label === 'Inquiries' ? (
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  title={l.label}
                  className={`relative flex w-full items-center rounded-lg text-sm font-medium no-underline transition-all ${
                    sidebarCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-4 py-2.5'
                  } text-[var(--color-muted)] hover:bg-[var(--color-bg)]`}
                >
                  <div className="relative">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: l.icon }} />
                    {sidebarCollapsed && newCount > 0 && (
                      <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-[var(--color-error)] text-[9px] font-bold leading-none text-white">
                        {newCount > 9 ? '9+' : newCount}
                      </span>
                    )}
                  </div>
                  {!sidebarCollapsed && (
                    <span className="flex flex-1 items-center justify-between">
                      {l.label}
                      {newCount > 0 && (
                        <span className="flex size-5 items-center justify-center rounded-full bg-[var(--color-error)] text-[10px] font-bold leading-none text-white">
                          {newCount > 99 ? '99+' : newCount}
                        </span>
                      )}
                    </span>
                  )}
                </button>
              ) : (
                <NavLink
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    `relative flex items-center rounded-lg text-sm font-medium no-underline transition-all ${
                      sidebarCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-4 py-2.5'
                    } ${
                      isActive
                        ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                        : 'text-[var(--color-muted)] hover:bg-[var(--color-bg)]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-[var(--color-primary)]" />}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: l.icon }} />
                      {!sidebarCollapsed && <span>{l.label}</span>}
                    </>
                  )}
                </NavLink>
              )}
            </div>
          ))}
        </nav>

        <div className="border-t border-[var(--color-border)] p-3">
          {!sidebarCollapsed && (
            <div className="mb-3 flex items-center gap-3 px-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-bold text-white shadow-sm">
                {user?.username?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--color-text)]">{user?.username}</p>
                <p className="truncate text-[10px] text-[var(--color-muted)]">Administrator</p>
              </div>
            </div>
          )}
          <NavLink to="/admin/profile" className={({ isActive }) => `flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${sidebarCollapsed ? 'justify-center' : ''} ${isActive ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-[var(--color-muted)] hover:bg-[var(--color-bg)]'}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            {!sidebarCollapsed && 'Profile'}
          </NavLink>
          <button onClick={() => { setPassError(''); setPassSuccess(false); setShowPasswordModal(true) }} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-bg)] ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
            {!sidebarCollapsed && 'Change Password'}
          </button>
          <button onClick={handleLogout} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-error)] transition-colors hover:bg-[var(--color-bg)] ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            {!sidebarCollapsed && 'Logout'}
          </button>
        </div>
      </aside>

      {notifOpen && (
        <div ref={notifRef} className={`fixed z-40 mt-14 max-h-[70vh] overflow-y-auto rounded-xl border border-[var(--color-border)] bg-white shadow-xl ${sidebarCollapsed ? 'left-20 ml-2' : 'left-64 ml-2'} top-0 w-80`}>
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
            <h3 className="text-sm font-bold text-[var(--color-text)]">Notifications</h3>
            {newCount > 0 && <span className="rounded-full bg-[var(--color-primary)]/10 px-2 py-0.5 text-xs font-medium text-[var(--color-primary)]">{newCount} new</span>}
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {recentNotifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-[var(--color-muted)]">
                <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-full bg-[var(--color-bg)]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                </div>
                <p>No new notifications</p>
              </div>
            ) : (
              recentNotifications.map((inq) => (
                <button key={inq.id} onClick={() => handleNotifyClick(inq)} className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--color-bg)]">
                  <div className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    inq.status === 'new' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'bg-[var(--color-muted)]/10 text-[var(--color-muted)]'
                  }`}>
                    {inq.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-[var(--color-text)]">{inq.name}</span>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        inq.status === 'new' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' :
                        inq.status === 'read' ? 'bg-[var(--color-muted)]/10 text-[var(--color-muted)]' :
                        inq.status === 'replied' ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' : ''
                      }`}>{inq.status}</span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-[var(--color-muted)]">{inq.message}</p>
                    <p className="mt-0.5 text-[10px] text-[var(--color-muted)]">{timeAgo(inq.created_at)}</p>
                  </div>
                </button>
              ))
            )}
          </div>
          <Link to="/admin/inquiries" onClick={() => setNotifOpen(false)} className="flex items-center justify-center gap-1 border-t border-[var(--color-border)] px-4 py-3 text-xs font-semibold text-[var(--color-primary)] no-underline transition-colors hover:bg-[var(--color-bg)]">
            View all inquiries
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      )}

      <main className="flex-1 overflow-auto">
        <div className="px-6 py-5">
          <Outlet />
        </div>
      </main>

      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={() => setSelectedInquiry(null)}>
          <div className="w-full max-w-lg rounded-xl border border-[var(--color-border)] bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
              <h2 className="text-base font-bold text-[var(--color-text)]">Inquiry Details</h2>
              <button onClick={() => setSelectedInquiry(null)} className="flex size-7 items-center justify-center rounded-lg text-[var(--color-muted)] transition-colors hover:bg-[var(--color-bg)] hover:text-[var(--color-text)]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="space-y-4 px-5 py-4">
              <div className="flex items-start gap-4">
                <div className={`flex size-11 shrink-0 items-center justify-center rounded-full text-base font-bold ${
                  selectedInquiry.status === 'new' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'bg-[var(--color-muted)]/10 text-[var(--color-muted)]'
                }`}>
                  {selectedInquiry.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-[var(--color-text)]">{selectedInquiry.name}</p>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      selectedInquiry.status === 'new' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' :
                      selectedInquiry.status === 'read' ? 'bg-[var(--color-muted)]/10 text-[var(--color-muted)]' :
                      selectedInquiry.status === 'replied' ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' :
                      selectedInquiry.status === 'archived' ? 'bg-[var(--color-border)] text-[var(--color-muted)]' :
                      'bg-[var(--color-error)]/10 text-[var(--color-error)]'
                    }`}>{selectedInquiry.status}</span>
                  </div>
                  <div className="mt-1 space-y-0.5 text-xs text-[var(--color-muted)]">
                    <p>{selectedInquiry.phone}</p>
                    {selectedInquiry.email && <p>{selectedInquiry.email}</p>}
                    <p>{new Date(selectedInquiry.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-[var(--color-bg)] p-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-muted)]">{selectedInquiry.message}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {(selectedInquiry.status === 'new' || selectedInquiry.status === 'read') && (
                  <button
                    onClick={() => {
                      handleMarkRead(selectedInquiry)
                      setSelectedInquiry(null)
                    }}
                    className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[var(--color-primary-light)]"
                  >
                    Mark {selectedInquiry.status === 'new' ? 'Read' : 'Replied'}
                  </button>
                )}
                <Link
                  to="/admin/inquiries"
                  onClick={() => setSelectedInquiry(null)}
                  className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-xs font-medium text-[var(--color-muted)] no-underline transition-colors hover:bg-[var(--color-bg)]"
                >
                  Go to Inquiries
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={() => setShowPasswordModal(false)}>
          <div className="w-full max-w-sm rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-4 text-base font-bold">Change Password</h2>
            {passSuccess ? (
              <div className="rounded-lg bg-[var(--color-success)]/10 p-4 text-center text-sm font-medium text-[var(--color-success)]">Password changed successfully!</div>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-3">
                {[['currentPassword', 'Current Password'], ['newPassword', 'New Password'], ['confirmPassword', 'Confirm New Password']].map(([key, label]) => (
                  <PasswordField key={key} label={label} value={passForm[key]} onChange={(v) => setPassForm({ ...passForm, [key]: v })} />
                ))}
                {passError && <p className="text-sm text-[var(--color-error)]">{passError}</p>}
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowPasswordModal(false)} className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-bg)]">Cancel</button>
                  <button type="submit" disabled={passSaving} className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-light)] disabled:opacity-50">{passSaving ? 'Saving...' : 'Save'}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
