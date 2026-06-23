import { useEffect, useRef } from 'react'

export default function ConfirmModal({ open, title, message, confirmLabel = 'Delete', onConfirm, onCancel, loading }) {
  const confirmRef = useRef(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => confirmRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function handleKey(e) {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 py-8 animate-fade-in" onClick={onCancel}>
      <div className="w-full max-w-sm rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[var(--color-error)]/10">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <h3 className="mb-2 text-center text-base font-bold text-[var(--color-text)]">{title || 'Confirm'}</h3>
        <p className="mb-5 text-center text-sm text-[var(--color-muted)]">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-bg)]">
            Cancel
          </button>
          <button ref={confirmRef} onClick={onConfirm} disabled={loading} className="flex-1 rounded-lg bg-[var(--color-error)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--color-error)]/90 disabled:opacity-50">
            {loading ? 'Deleting...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
