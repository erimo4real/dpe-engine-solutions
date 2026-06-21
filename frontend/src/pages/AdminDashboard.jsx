import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { updateInquiryStatus } from '../features/inquiries/inquiriesSlice'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const categoryColors = {
  Generators: '#1e3a5f',
  'Engine Parts': '#d97706',
  Engines: '#16a34a',
}

const statCards = [
  { key: 'new', label: 'New Inquiries', color: 'bg-[var(--color-primary)]', icon: '<circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />' },
  { key: 'total', label: 'Total Inquiries', color: 'bg-[var(--color-success)]', icon: '<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />' },
  { key: 'products', label: 'Products', color: 'bg-[var(--color-primary-light)]', icon: '<path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />' },
  { key: 'categories', label: 'Categories', color: 'bg-[var(--color-secondary)]', icon: '<path d="M4 6h16M4 12h16M4 18h16" />' },
]

const chartColors = ['#1e3a5f', '#2a5298', '#d97706', '#16a34a', '#dc2626', '#7c3aed', '#0891b2', '#ca8a04', '#be185d', '#65a30d']

const statusConfig = {
  new: { label: 'New', color: '#1e3a5f' },
  read: { label: 'Read', color: '#64748b' },
  replied: { label: 'Replied', color: '#16a34a' },
  archived: { label: 'Archived', color: '#e2e8f0' },
  spam: { label: 'Spam', color: '#dc2626' },
}

export default function AdminDashboard() {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const { items: inquiries, loading: inquiriesLoading } = useSelector((s) => s.inquiries)
  const { items: products } = useSelector((s) => s.products)
  const { items: categories } = useSelector((s) => s.categories)

  const stats = {
    new: inquiries.filter((i) => i.status === 'new').length,
    total: inquiries.length,
    products: products.length,
    categories: categories.length,
  }

  const categorySpecs = useMemo(() => {
    return categories.map((cat) => {
      const catProducts = products.filter((p) => p.category_id === cat.id)
      const specCount = {}
      catProducts.forEach((p) => {
        if (Array.isArray(p.specs)) {
          p.specs.forEach((s) => {
            const key = s.trim()
            if (key) specCount[key] = (specCount[key] || 0) + 1
          })
        }
      })
      return {
        ...cat,
        productCount: catProducts.length,
        specs: Object.entries(specCount)
          .map(([spec, count]) => ({ spec, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
      }
    })
  }, [categories, products])

  const inquiryChartData = useMemo(() => {
    const counts = { new: 0, read: 0, replied: 0, archived: 0, spam: 0 }
    inquiries.forEach((i) => { if (counts[i.status] !== undefined) counts[i.status]++ })
    return Object.entries(counts).map(([key, value]) => ({ name: statusConfig[key].label, value, color: statusConfig[key].color }))
  }, [inquiries])

  const dailyTrend = useMemo(() => {
    const days = {}
    const now = new Date()
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const key = d.toLocaleDateString('en', { month: 'short', day: 'numeric' })
      days[key] = 0
    }
    inquiries.forEach((inq) => {
      const d = new Date(inq.created_at)
      const key = d.toLocaleDateString('en', { month: 'short', day: 'numeric' })
      if (days[key] !== undefined) days[key]++
    })
    return Object.entries(days).map(([date, count]) => ({ date, count }))
  }, [inquiries])

  return (
    <div className="animate-fade-slide-in">
      <Helmet><title>Dashboard | DPE Admin</title></Helmet>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Dashboard</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Overview of your generator business</p>
      </div>

      <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.key} className="group relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">{card.label}</p>
                <p className="mt-1.5 text-3xl font-bold text-[var(--color-text)]">{stats[card.key]}</p>
              </div>
              <div className={`flex size-12 items-center justify-center rounded-xl text-white shadow-sm ${card.color}`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: card.icon }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-sm font-bold text-[var(--color-text)]">Product Specs by Category</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categorySpecs.map((cat) => {
              const color = categoryColors[cat.name] || chartColors[0]
              return (
                <div key={cat.id} className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[var(--color-text)]">{cat.name}</h3>
                      <p className="text-xs text-[var(--color-muted)]">{cat.productCount} product{cat.productCount !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex size-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}15` }}>
                      <span className="text-lg font-bold" style={{ color }}>{cat.productCount}</span>
                    </div>
                  </div>
                  {cat.specs.length === 0 ? (
                    <div className="flex h-40 items-center justify-center rounded-lg bg-[var(--color-bg)]">
                      <p className="text-xs text-[var(--color-muted)]">No spec data</p>
                    </div>
                  ) : (
                    <div className="h-44">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={cat.specs} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                          <XAxis type="number" hide />
                          <YAxis type="category" dataKey="spec" width={90} tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
                          <Tooltip
                            contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                            formatter={(value) => [value, 'Products']}
                          />
                          <Bar dataKey="count" fill={color} radius={[0, 4, 4, 0]} barSize={12} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {inquiries.length > 0 && (
        <div className="mb-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-[var(--color-text)]">Inquiry Status</h3>
            <div className="flex h-44 items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={inquiryChartData} cx="50%" cy="50%" innerRadius={48} outerRadius={64} paddingAngle={3} dataKey="value">
                    {inquiryChartData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5">
                {inquiryChartData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <span className="size-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-[var(--color-muted)]">{d.name}</span>
                    <span className="font-medium text-[var(--color-text)]">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-[var(--color-text)]">Daily Trend (14 days)</h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyTrend} margin={{ top: 0, right: 0, left: -16, bottom: 0 }}>
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#64748b' }} tickLine={false} axisLine={false} interval={0} angle={-20} textAnchor="end" height={20} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} width={24} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }} />
                  <Bar dataKey="count" fill="#1e3a5f" radius={[3, 3, 0, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-[var(--color-border)] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
          <h2 className="text-sm font-bold text-[var(--color-text)]">Recent Inquiries</h2>
          <span className="rounded-full bg-[var(--color-primary)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--color-primary)]">{inquiries.length} total</span>
        </div>
        {inquiriesLoading ? (
          <div className="flex justify-center py-12"><div className="size-7 animate-spin rounded-full border-3 border-[var(--color-border)] border-t-[var(--color-primary)]" /></div>
        ) : inquiries.length === 0 ? (
          <div className="p-8 text-center text-sm text-[var(--color-muted)]">No inquiries yet.</div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {inquiries.slice(0, 10).map((inq) => (
              <div key={inq.id} className="flex items-center justify-between px-6 py-3.5 transition-colors hover:bg-[var(--color-bg)]">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-xs font-bold text-[var(--color-primary)]">
                      {inq.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[var(--color-text)]">{inq.name}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          inq.status === 'new' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' :
                          inq.status === 'read' ? 'bg-[var(--color-muted)]/10 text-[var(--color-muted)]' :
                          inq.status === 'replied' ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' :
                          inq.status === 'archived' ? 'bg-[var(--color-border)] text-[var(--color-muted)]' :
                          'bg-[var(--color-error)]/10 text-[var(--color-error)]'
                        }`}>{inq.status}</span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-[var(--color-muted)]">
                        <span>{inq.phone}</span>
                        <span>&middot;</span>
                        <span>{inq.message?.slice(0, 100)}{inq.message?.length > 100 ? '...' : ''}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  {inq.status === 'new' && (
                    <button onClick={() => dispatch(updateInquiryStatus({ id: inq.id, status: 'read' }))} className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-[11px] font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-bg)]">Mark Read</button>
                  )}
                  {inq.status === 'read' && (
                    <button onClick={() => dispatch(updateInquiryStatus({ id: inq.id, status: 'replied' }))} className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-[11px] font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-bg)]">Mark Replied</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
