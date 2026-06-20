import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../features/products/productsSlice'
import { fetchCategories } from '../features/categories/categoriesSlice'
import { api } from '../services/api'
import Pagination from '../components/Pagination'

const PAGE_SIZE = 6

export default function AdminProducts() {
  const dispatch = useDispatch()
  const { items: products, loading, saving, deleting } = useSelector((s) => s.products)
  const { items: categories } = useSelector((s) => s.categories)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', specs: '', image_url: '', category_id: '', sort_order: '0' })
  const [page, setPage] = useState(1)

  useEffect(() => {
    dispatch(fetchProducts())
    dispatch(fetchCategories())
  }, [dispatch])

  const totalPages = Math.ceil(products.length / PAGE_SIZE)
  const pagedProducts = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => { setPage(1) }, [products.length])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', description: '', specs: '', image_url: '', category_id: categories.length > 0 ? categories[0].id.toString() : '', sort_order: '0' })
    setShowForm(true)
  }

  const openEdit = (p) => {
    setEditing(p.id)
    setForm({
      name: p.name, description: p.description || '',
      specs: Array.isArray(p.specs) ? p.specs.join('\n') : (p.specs ? JSON.stringify(p.specs) : ''),
      image_url: p.image_url || '', category_id: p.category_id?.toString() || '', sort_order: p.sort_order?.toString() || '0',
    })
    setShowForm(true)
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try { const data = await api.upload(file); setForm((f) => ({ ...f, image_url: data.url })) }
    catch { alert('Upload failed') }
    finally { setUploading(false) }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const body = {
      name: form.name, description: form.description,
      specs: form.specs.includes('\n') ? form.specs.split('\n').filter(Boolean) : form.specs ? [form.specs] : [],
      image_url: form.image_url, category_id: parseInt(form.category_id), sort_order: parseInt(form.sort_order) || 0,
    }
    try {
      editing ? await dispatch(updateProduct({ id: editing, ...body })).unwrap() : await dispatch(createProduct(body)).unwrap()
      setShowForm(false)
    } catch { alert('Failed to save product') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    try { await dispatch(deleteProduct(id)).unwrap() } catch { alert('Failed to delete product') }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Products</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">{products.length} products in your catalog</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--color-primary-light)] hover:shadow-md">+ Add Product</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="size-8 animate-spin rounded-full border-3 border-[var(--color-border)] border-t-[var(--color-primary)]" /></div>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-12 text-center">
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-[var(--color-bg)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          </div>
          <p className="text-sm font-medium text-[var(--color-muted)]">No products yet</p>
          <p className="mt-1 text-xs text-[var(--color-muted)]">Create your first product to get started.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)] text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                <th className="px-5 py-3.5">Product</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Image</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {pagedProducts.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-[var(--color-bg)]">
                  <td className="px-5 py-4">
                    <p className="font-medium text-[var(--color-text)]">{p.name}</p>
                    {p.description && <p className="mt-0.5 text-xs text-[var(--color-muted)] line-clamp-1">{p.description}</p>}
                  </td>
                  <td className="px-5 py-4"><span className="rounded-full bg-[var(--color-bg)] px-2.5 py-1 text-xs font-medium text-[var(--color-muted)]">{p.categories?.name || '-'}</span></td>
                  <td className="px-5 py-4">{p.image_url ? <img src={p.image_url} alt="" className="h-10 w-10 rounded-lg border border-[var(--color-border)] object-cover" /> : <span className="text-xs text-[var(--color-muted)]">—</span>}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-[11px] font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-bg)]">Edit</button>
                      <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-[11px] font-medium text-[var(--color-error)] transition-colors hover:bg-[var(--color-error)]/10 disabled:opacity-50">{deleting === p.id ? 'Deleting...' : 'Delete'}</button>
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
          <div className="w-full max-w-lg rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-4 text-base font-bold text-[var(--color-text)]">{editing ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Name</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-muted)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] pl-9 pr-4 py-2.5 text-sm outline-none transition-all focus:border-[var(--color-primary)] focus:bg-white focus:shadow-sm hover:border-[var(--color-border)]" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Category</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-muted)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                  <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="w-full appearance-none rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] pl-9 pr-8 py-2.5 text-sm outline-none transition-all focus:border-[var(--color-primary)] focus:bg-white focus:shadow-sm hover:border-[var(--color-border)]">
                    <option value="" disabled>Select a category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-muted)]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm outline-none transition-all focus:border-[var(--color-primary)] focus:bg-white hover:border-[var(--color-border)]" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Specs (one per line)</label>
                <textarea rows={3} value={form.specs} onChange={(e) => setForm({ ...form, specs: e.target.value })} className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm outline-none transition-all focus:border-[var(--color-primary)] focus:bg-white hover:border-[var(--color-border)]" placeholder="Fuel efficient&#10;Single phase&#10;Electric start" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Image</label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-muted)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] pl-9 pr-4 py-2.5 text-sm outline-none transition-all focus:border-[var(--color-primary)] focus:bg-white focus:shadow-sm hover:border-[var(--color-border)]" placeholder="Image URL" />
                  </div>
                  <label className="cursor-pointer rounded-lg border border-[var(--color-border)] bg-white px-4 py-2.5 text-xs font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-bg)]">
                    {uploading ? 'Uploading...' : 'Upload'}
                    <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleUpload} disabled={uploading} />
                  </label>
                </div>
                {form.image_url && <img src={form.image_url} alt="preview" className="mt-2 h-16 w-16 rounded-lg border border-[var(--color-border)] object-cover" />}
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
                {saving && <span className="ml-2 size-4 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)]" />}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
