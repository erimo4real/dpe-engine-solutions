import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../features/categories/categoriesSlice'
import Pagination from '../components/Pagination'

const PAGE_SIZE = 6

export default function AdminCategories() {
  const dispatch = useDispatch()
  const { items: categories, loading, saving, deleting } = useSelector((s) => s.categories)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', slug: '', sort_order: '0' })
  const [page, setPage] = useState(1)
  const slugManuallyEdited = useRef(false)

  useEffect(() => { dispatch(fetchCategories()) }, [dispatch])
  useEffect(() => { setPage(1) }, [categories.length])

  const totalPages = Math.ceil(categories.length / PAGE_SIZE)
  const pagedCategories = categories.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const openCreate = () => { setEditing(null); setForm({ name: '', slug: '', sort_order: '0' }); slugManuallyEdited.current = false; setShowForm(true) }
  const openEdit = (c) => { setEditing(c.id); setForm({ name: c.name, slug: c.slug, sort_order: c.sort_order?.toString() || '0' }); slugManuallyEdited.current = true; setShowForm(true) }
  const generateSlug = (name) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const handleSave = async (e) => {
    e.preventDefault()
    const body = { name: form.name, slug: form.slug || generateSlug(form.name), sort_order: parseInt(form.sort_order) || 0 }
    try {
      if (editing) {
        await dispatch(updateCategory({ id: editing, ...body })).unwrap()
      } else {
        await dispatch(createCategory(body)).unwrap()
      }
      setShowForm(false)
    } catch { alert('Failed to save category') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this category? Related products may lose their category association.')) return
    try { await dispatch(deleteCategory(id)).unwrap() }
    catch { alert('Failed to delete category') }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Categories</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">{categories.length} categories</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--color-primary-light)] hover:shadow-md">+ Add Category</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="size-8 animate-spin rounded-full border-3 border-[var(--color-border)] border-t-[var(--color-primary)]" /></div>
      ) : categories.length === 0 ? (
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-12 text-center">
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-[var(--color-bg)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          </div>
          <p className="text-sm font-medium text-[var(--color-muted)]">No categories yet</p>
          <p className="mt-1 text-xs text-[var(--color-muted)]">Create your first category to organize products.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)] text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                <th className="px-5 py-3.5">Name</th>
                <th className="px-5 py-3.5">Slug</th>
                <th className="px-5 py-3.5">Order</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {pagedCategories.map((c) => (
                <tr key={c.id} className="transition-colors hover:bg-[var(--color-bg)]">
                  <td className="px-5 py-4 font-medium text-[var(--color-text)]">{c.name}</td>
                  <td className="px-5 py-4"><code className="rounded bg-[var(--color-bg)] px-2 py-0.5 text-xs text-[var(--color-muted)]">{c.slug}</code></td>
                  <td className="px-5 py-4 text-[var(--color-muted)]">{c.sort_order}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(c)} className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-[11px] font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-bg)]">Edit</button>
                      <button onClick={() => handleDelete(c.id)} disabled={deleting === c.id} className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-[11px] font-medium text-[var(--color-error)] transition-colors hover:bg-red-50 disabled:opacity-50">{deleting === c.id ? 'Deleting...' : 'Delete'}</button>
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

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-md rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-4 text-base font-bold text-[var(--color-text)]">{editing ? 'Edit Category' : 'Add Category'}</h2>
            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Name</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-muted)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  <input required value={form.name} onChange={(e) => {
                    const val = e.target.value
                    setForm({ ...form, name: val, slug: slugManuallyEdited.current ? form.slug : generateSlug(val) })
                  }} className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] pl-9 pr-4 py-2.5 text-sm outline-none transition-all focus:border-[var(--color-primary)] focus:bg-white focus:shadow-sm hover:border-[var(--color-border)]" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Slug</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-muted)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                  <input required value={form.slug} onChange={(e) => { slugManuallyEdited.current = true; setForm({ ...form, slug: e.target.value }) }} className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] pl-9 pr-4 py-2.5 text-sm outline-none transition-all focus:border-[var(--color-primary)] focus:bg-white focus:shadow-sm hover:border-[var(--color-border)]" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Sort Order</label>
                <div className="relative w-24">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-muted)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
                  <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] pl-9 pr-3 py-2.5 text-sm outline-none transition-all focus:border-[var(--color-primary)] focus:bg-white focus:shadow-sm hover:border-[var(--color-border)]" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-bg)]">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--color-primary-light)] hover:shadow-md disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
