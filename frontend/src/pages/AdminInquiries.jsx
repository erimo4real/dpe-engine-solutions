import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchInquiries, updateInquiryStatus, deleteInquiry } from '../features/inquiries/inquiriesSlice'
import Pagination from '../components/Pagination'

const PAGE_SIZE = 6

export default function AdminInquiries() {
  const dispatch = useDispatch()
  const { items: inquiries, loading } = useSelector((s) => s.inquiries)
  const [expanded, setExpanded] = useState(null)
  const [page, setPage] = useState(1)
  const [showArchived, setShowArchived] = useState(false)

  useEffect(() => { dispatch(fetchInquiries()) }, [dispatch])

  const activeInquiries = inquiries.filter((i) => !['archived', 'spam'].includes(i.status))
  const archivedSpamCount = inquiries.length - activeInquiries.length
  const visibleInquiries = showArchived ? inquiries : activeInquiries
  const totalPages = Math.ceil(visibleInquiries.length / PAGE_SIZE)
  const pagedInquiries = visibleInquiries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => { setExpanded(null) }, [page])

  const handleDelete = (id) => {
    if (!confirm('Delete this inquiry?')) return
    dispatch(deleteInquiry(id))
  }

  const statusColors = {
    new: 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]',
    read: 'bg-[var(--color-muted)]/10 text-[var(--color-muted)]',
    replied: 'bg-[var(--color-success)]/10 text-[var(--color-success)]',
    archived: 'bg-[var(--color-border)] text-[var(--color-muted)]',
    spam: 'bg-[var(--color-error)]/10 text-[var(--color-error)]',
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Inquiries</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">{inquiries.length} total, {inquiries.filter((i) => i.status === 'new').length} unread</p>
        </div>
        <button
          onClick={() => { setShowArchived((v) => !v); setPage(1) }}
          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
            showArchived
              ? 'border-purple-200 bg-purple-50 text-purple-700'
              : 'border-[var(--color-border)] text-[var(--color-muted)] hover:bg-[var(--color-bg)]'
          }`}
        >
          {showArchived ? 'Hide archived/spam' : `Show archived/spam (${archivedSpamCount})`}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="size-8 animate-spin rounded-full border-3 border-[var(--color-border)] border-t-[var(--color-primary)]" /></div>
      ) : inquiries.length === 0 ? (
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-12 text-center">
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-[var(--color-bg)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
          </div>
          <p className="text-sm font-medium text-[var(--color-muted)]">No inquiries yet</p>
          <p className="mt-1 text-xs text-[var(--color-muted)]">Customer inquiries will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pagedInquiries.map((inq) => (
            <div key={inq.id} className="rounded-xl border border-[var(--color-border)] bg-white shadow-sm transition-all hover:shadow-md">
              <button onClick={() => setExpanded(expanded === inq.id ? null : inq.id)} className="flex w-full items-center gap-4 px-5 py-4 text-left">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-sm font-bold text-[var(--color-primary)]">
                  {inq.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-semibold text-[var(--color-text)]">{inq.name}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusColors[inq.status] || 'bg-gray-50 text-gray-500'}`}>{inq.status}</span>
                    <span className={`size-2 rounded-full ${inq.status === 'new' ? 'bg-[var(--color-primary)]' : inq.status === 'read' ? 'bg-[var(--color-muted)]' : inq.status === 'replied' ? 'bg-[var(--color-success)]' : inq.status === 'archived' ? 'bg-[var(--color-border)]' : inq.status === 'spam' ? 'bg-[var(--color-error)]' : ''}`} />
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-[var(--color-muted)]">
                    <span>{inq.phone}</span>
                    {inq.email && <><span>&middot;</span><span>{inq.email}</span></>}
                    <span>&middot;</span>
                    <span>{new Date(inq.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <svg className={`shrink-0 text-[var(--color-muted)] transition-transform ${expanded === inq.id ? 'rotate-180' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
              </button>
              {expanded === inq.id && (
                <div className="border-t border-[var(--color-border)] px-5 py-4">
                  <div className="mb-4 whitespace-pre-wrap rounded-lg bg-[var(--color-bg)] p-4 text-sm leading-relaxed text-[var(--color-muted)]">{inq.message}</div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
                      <span>{new Date(inq.created_at).toLocaleString()}</span>
                      {inq.read_at && <><span>&middot;</span><span>Read: {new Date(inq.read_at).toLocaleString()}</span></>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(inq.status === 'new' || inq.status === 'read') && (
                        <button onClick={() => dispatch(updateInquiryStatus({ id: inq.id, status: inq.status === 'new' ? 'read' : 'replied' }))} className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-[11px] font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-bg)]">
                          Mark {inq.status === 'new' ? 'Read' : 'Replied'}
                        </button>
                      )}
                      {inq.status === 'replied' && (
                        <button onClick={() => dispatch(updateInquiryStatus({ id: inq.id, status: 'read' }))} className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-[11px] font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-bg)]">Revert to Read</button>
                      )}
                      {!['archived', 'spam'].includes(inq.status) && (
                        <>
                          <button onClick={() => dispatch(updateInquiryStatus({ id: inq.id, status: 'archived' }))} className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-[11px] font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-muted)]/10">Archive</button>
                          <button onClick={() => dispatch(updateInquiryStatus({ id: inq.id, status: 'spam' }))} className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-[11px] font-medium text-[var(--color-error)] transition-colors hover:bg-[var(--color-error)]/10">Spam</button>
                        </>
                      )}
                      <button onClick={() => handleDelete(inq.id)} className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-[11px] font-medium text-[var(--color-error)] transition-colors hover:bg-[var(--color-error)]/10">Delete</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      )}
    </div>
  )
}
