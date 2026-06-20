import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, useLocation, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { fetchProducts } from '../features/products/productsSlice'
import { fetchCategories } from '../features/categories/categoriesSlice'
import ProductCard from '../components/ProductCard'
import Pagination from '../components/Pagination'
import CTASection from '../components/CTASection'
import { COMPANY_NAME, WHATSAPP_NUMBER } from '../constants'

const ALL_SECTION_LIMIT = 10
const CATEGORY_PAGE_SIZE = 10

export default function Products() {
  const dispatch = useDispatch()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const categorySlug = searchParams.get('category')
  const searchQuery = searchParams.get('search')
  const { items: products, loading } = useSelector((s) => s.products)
  const { items: categories } = useSelector((s) => s.categories)
  const [selected, setSelected] = useState(location.state?.selectedProduct || null)
  const [categoryPage, setCategoryPage] = useState(1)
  const modalRef = useRef(null)
  const selectProduct = useCallback((p) => {
    setSelected(p)
    setTimeout(() => modalRef.current?.scrollTo({ top: 0, behavior: 'smooth' }), 50)
  }, [])
  const related = useMemo(() => {
    if (!selected) return []
    return products.filter((p) => p.categories?.slug === selected.categories?.slug && p.id !== selected.id).slice(0, 4)
  }, [products, selected])

  useEffect(() => {
    if (!products.length) dispatch(fetchProducts())
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    if (location.state?.selectedProduct) {
      window.history.replaceState({}, document.title)
    }
  }, [])

  useEffect(() => {
    setCategoryPage(1)
  }, [categorySlug])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [categoryPage])

  useEffect(() => {
    if (!selected) return
    function handleKey(e) { if (e.key === 'Escape') setSelected(null) }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [selected])

  const activeCategory = useMemo(
    () => categories.find((c) => c.slug === categorySlug),
    [categories, categorySlug],
  )

  const filteredProducts = useMemo(() => {
    let list = products
    if (categorySlug) list = list.filter((p) => p.categories?.slug === categorySlug)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.categories?.name?.toLowerCase().includes(q))
    }
    return list
  }, [products, categorySlug, searchQuery])

  const pageTitle = `${activeCategory ? activeCategory.name + ' - ' : searchQuery ? `Search: ${searchQuery} - ` : ''}Products | ${COMPANY_NAME}`

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={`Browse ${activeCategory ? activeCategory.name.toLowerCase() : 'our range of generators and genuine engine parts'} at ${COMPANY_NAME}. Contact us for pricing and delivery in Lagos.`} />
      </Helmet>
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-block rounded-full bg-[var(--color-primary)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">{activeCategory ? activeCategory.name : 'Our Catalog'}</span>
          <h1 className="mt-4 text-[clamp(1.8rem,3.5vw,3rem)] font-bold">{activeCategory ? activeCategory.name : 'Our Products'}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--color-muted)]">
            {searchQuery ? `Search results for "${searchQuery}".` : activeCategory ? `Browse our ${activeCategory.name.toLowerCase()} range.` : 'Explore our range of generators and genuine engine parts. All items are sourced from trusted suppliers.'}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link to="/products" className={`rounded-full px-4 py-2 text-xs font-semibold no-underline transition-colors ${!categorySlug ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-border)] text-[var(--color-muted)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)]'}`}>All</Link>
            {categories.map((c) => (
              <Link key={c.id} to={`/products?category=${c.slug}`} className={`rounded-full px-4 py-2 text-xs font-semibold no-underline transition-colors ${categorySlug === c.slug ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-border)] text-[var(--color-muted)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)]'}`}>{c.name}</Link>
            ))}
          </div>
        </div>
      </section>

      {loading ? (
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mx-auto size-8 animate-spin rounded-full border-3 border-[var(--color-border)] border-t-[var(--color-primary)]" />
          </div>
        </section>
      ) : !filteredProducts.length ? (
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[var(--color-border)]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            </div>
            <p className="text-sm font-medium text-[var(--color-muted)]">No products found.</p>
          </div>
        </section>
      ) : (
        (categorySlug ? categories.filter((c) => c.slug === categorySlug) : categories).map((cat) => {
          const catProducts = filteredProducts.filter((p) => p.categories?.slug === cat.slug)
          if (!catProducts.length) return null

          const isAllView = !categorySlug && !searchQuery
          const displayProducts = isAllView ? catProducts.slice(0, ALL_SECTION_LIMIT) : catProducts

          if (isAllView) {
            return (
              <section key={cat.id} className="py-14 sm:py-20 even:bg-[var(--color-surface)]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-xl font-bold">{cat.name}</h2>
                    {catProducts.length > ALL_SECTION_LIMIT && (
                      <Link to={`/products?category=${cat.slug}`} className="text-sm font-semibold text-[var(--color-primary)] no-underline transition-colors hover:underline">
                        View all ({catProducts.length})
                      </Link>
                    )}
                  </div>
                  <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {displayProducts.map((p) => (
                      <ProductCard
                        key={p.id}
                        name={p.name}
                        description={p.description}
                        image={p.image_url}
                        onClick={() => selectProduct(p)}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )
          }

          const totalPages = Math.ceil(catProducts.length / CATEGORY_PAGE_SIZE)
          const pagedProducts = catProducts.slice((categoryPage - 1) * CATEGORY_PAGE_SIZE, categoryPage * CATEGORY_PAGE_SIZE)

          return (
            <section key={cat.id} className="py-14 sm:py-20 even:bg-[var(--color-surface)]">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="mb-8 text-xl font-bold">{cat.name}</h2>
                <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {pagedProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      name={p.name}
                      description={p.description}
                      image={p.image_url}
                      onClick={() => selectProduct(p)}
                    />
                  ))}
                </div>
                <Pagination page={categoryPage} totalPages={totalPages} onChange={setCategoryPage} />
              </div>
            </section>
          )
        })
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in"
          onClick={() => setSelected(null)}
        >
          <div
            ref={modalRef}
            className="relative max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-xl bg-white shadow-2xl mx-[30px] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[var(--color-border)] bg-white px-6 py-4 sm:px-8">
              <div className="min-w-0 flex-1 pr-4">
                <span className="inline-block rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-primary)]">{selected.categories?.name || 'Product'}</span>
                <h2 className="mt-1 truncate text-lg font-bold leading-tight sm:text-xl">{selected.name}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-border)] text-[var(--color-muted)] transition-colors hover:bg-[var(--color-border)] hover:text-[var(--color-text)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div key={selected.id} className="animate-fade-slide-in">
              <div className="grid sm:grid-cols-2">
                <div className="flex flex-col justify-center p-6 sm:p-8">
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[var(--color-accent)]">Call for price</span>
                  </div>
                  {selected.description && <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted)]">{selected.description}</p>}
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello! I'm interested in the ${selected.name}. Please send more details.`)}`} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-success)] px-6 py-3 text-sm font-bold text-white no-underline shadow-sm transition-all hover:opacity-90 hover:shadow-md sm:self-start">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Inquire Now
                  </a>
                </div>
                {selected.image_url && (
                  <div className="flex items-center justify-center bg-[var(--color-bg)] p-6 sm:p-8">
                    <img src={selected.image_url} alt={selected.name} className="max-h-[300px] w-full object-contain sm:max-h-[400px]" />
                  </div>
                )}
              </div>

              <div className="border-t border-[var(--color-border)] px-6 py-6 sm:px-8 sm:py-8">
                <h3 className="mb-4 text-base font-bold text-[var(--color-text)]">Description</h3>
                <p className="text-sm leading-relaxed text-[var(--color-muted)]">{selected.description || 'No description available.'}</p>
              </div>

              {selected.specs && (Array.isArray(selected.specs) ? selected.specs : Object.entries(selected.specs)).length > 0 && (
                <div className="border-t border-[var(--color-border)] px-6 pb-8 sm:px-8">
                  <h3 className="mb-4 pt-6 text-base font-bold text-[var(--color-text)] sm:pt-8">Specifications</h3>
                  <div className="overflow-hidden rounded-lg border border-[var(--color-border)]">
                    {(Array.isArray(selected.specs) ? selected.specs : Object.entries(selected.specs)).map((item, i) => {
                      const label = Array.isArray(selected.specs) ? null : item[0].replace(/_/g, ' ')
                      const value = Array.isArray(selected.specs) ? item : item[1]
                      if (!value) return null
                      return (
                        <div key={i} className={`flex items-center gap-4 px-4 py-2.5 text-sm ${i % 2 === 0 ? 'bg-[var(--color-bg)]' : 'bg-white'}`}>
                          {label && <span className="min-w-[120px] font-medium capitalize text-[var(--color-text)] sm:min-w-[160px]">{label}</span>}
                          <span className="text-[var(--color-muted)]">{value}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {related.length > 0 && (
                <div className="border-t border-[var(--color-border)] px-6 py-6 sm:px-8 sm:py-8">
                  <h3 className="mb-4 text-base font-bold text-[var(--color-text)]">You may also like</h3>
                  <div className="-mx-6 flex gap-4 overflow-x-auto px-6 pb-2 sm:-mx-8 sm:px-8">
                    {related.map((p) => (
                      <div key={p.id} onClick={() => selectProduct(p)} className="w-56 flex-shrink-0 cursor-pointer overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                        {p.image_url && (
                          <div className="aspect-[4/3] overflow-hidden bg-[var(--color-bg)]">
                            <img src={p.image_url} alt={p.name} className="h-full w-full object-cover transition-all duration-500 hover:scale-110" />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="text-sm font-bold leading-tight">{p.name}</h3>
                          <span className="mt-1 block text-xs font-medium text-[var(--color-accent)]">Call for price</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <CTASection
        title="Don't See What You Need?"
        subtitle="We can source any generator or part. Contact us with your requirements and we'll get back to you fast."
      />
    </>
  )
}
