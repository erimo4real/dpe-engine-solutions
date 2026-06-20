import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCategories } from '../features/categories/categoriesSlice'
import { api } from '../services/api'
import { WHATSAPP_NUMBER } from '../constants'

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items: categories } = useSelector((s) => s.categories)
  const [open, setOpen] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const catRef = useRef(null)
  const searchRef = useRef(null)
  const inputRef = useRef(null)
  const timerRef = useRef(null)

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/contact', label: 'Contact' },
  ]

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    function handleClick(e) {
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false)
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false)
        setQuery('')
        setResults([])
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus()
  }, [searchOpen])

  const doSearch = useCallback(async (q) => {
    if (!q.trim()) { setResults([]); return }
    setLoading(true)
    try {
      const data = await api.products.search(q)
      setResults(data.products?.slice(0, 5) || [])
    } catch { setResults([]) }
    setLoading(false)
  }, [])

  function handleSearchInput(e) {
    const val = e.target.value
    setQuery(val)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => doSearch(val), 300)
  }

  function handleSearchKeyDown(e) {
    if (e.key === 'Escape') { setSearchOpen(false); setQuery(''); setResults([]) }
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`)
      setSearchOpen(false); setQuery(''); setResults([]); setOpen(false)
    }
  }

  function selectProduct(product) {
    navigate('/products', { state: { selectedProduct: product } })
    setSearchOpen(false); setQuery(''); setResults([]); setOpen(false)
  }

  function viewAllResults() {
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`)
    }
    setSearchOpen(false); setQuery(''); setResults([]); setOpen(false)
  }

  function toggleSearch() {
    setSearchOpen(!searchOpen)
    if (!searchOpen) { setQuery(''); setResults([]) }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-[var(--color-primary)] no-underline">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span>DPE</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            className="flex size-10 items-center justify-center rounded-lg md:hidden"
            onClick={toggleSearch}
            aria-label="Search"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
          <button
            className="flex size-10 items-center justify-center rounded-lg md:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {open ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <ul className={`absolute left-0 right-0 top-full flex-col border-b border-[var(--color-border)] bg-[var(--color-surface)] p-4 md:static md:flex md:flex-row md:items-center md:gap-1 md:border-none md:p-0 ${open ? 'flex' : 'hidden'}`}>
          {links.slice(0, 2).map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-2 text-sm font-medium transition-colors no-underline ${
                    isActive
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'text-[var(--color-text)] hover:bg-[var(--color-border)]'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
          <li className="relative" ref={catRef}>
            <button
              onClick={() => setCatOpen(!catOpen)}
              className="flex w-full items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-border)] md:w-auto"
            >
              Products
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${catOpen ? 'rotate-180' : ''}`}>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {catOpen && (
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2 shadow-lg md:absolute md:left-0 md:top-full md:mt-1 md:w-48">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/products?category=${cat.slug}`}
                    onClick={() => { setCatOpen(false); setOpen(false) }}
                    className="block rounded-lg px-4 py-2 text-sm font-medium text-[var(--color-text)] no-underline transition-colors hover:bg-[var(--color-border)]"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </li>
          {links.slice(2).map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-2 text-sm font-medium transition-colors no-underline ${
                    isActive
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'text-[var(--color-text)] hover:bg-[var(--color-border)]'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}

          <li className="relative md:hidden">
            <div className="relative">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" aria-hidden="true">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={handleSearchInput}
                onKeyDown={handleSearchKeyDown}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] py-2 pl-9 pr-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]"
              />
            </div>
            {searchOpen && results.length > 0 && (
              <div className="mt-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2 shadow-lg">
                {results.map((p) => (
                  <button key={p.id} onClick={() => selectProduct(p)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-[var(--color-text)] transition-colors hover:bg-[var(--color-border)]">
                    {p.image_url && <img src={p.image_url} alt="" className="size-10 flex-shrink-0 rounded-lg object-cover" />}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{p.name}</p>
                      <p className="text-xs text-[var(--color-muted)]">{p.categories?.name}</p>
                    </div>
                  </button>
                ))}
                <button onClick={viewAllResults} className="mt-1 w-full rounded-lg px-3 py-2 text-center text-xs font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-border)]">
                  View all results
                </button>
              </div>
            )}
          </li>

          <li className="md:hidden">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-[var(--color-success)] px-4 py-2 text-sm font-semibold text-white no-underline transition-opacity hover:opacity-90"
              onClick={() => setOpen(false)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
          </li>
        </ul>

        <div className="hidden md:relative md:flex md:items-center md:gap-2">
          <div ref={searchRef} className="relative">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" aria-hidden="true">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={handleSearchInput}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={handleSearchKeyDown}
              className="w-48 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] py-2 pl-9 pr-3 text-sm text-[var(--color-text)] outline-none transition-all placeholder:text-[var(--color-muted)] focus:w-64 focus:border-[var(--color-primary)] lg:w-56 lg:focus:w-72"
            />
            {searchOpen && query.trim() && (
              <div className="absolute right-0 top-full mt-1 w-80 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2 shadow-lg">
                {loading ? (
                  <div className="flex items-center justify-center gap-2 px-3 py-4 text-sm text-[var(--color-muted)]">
                    <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" /><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" /></svg>
                    Searching...
                  </div>
                ) : results.length > 0 ? (
                  <>
                    {results.map((p) => (
                      <button key={p.id} onClick={() => selectProduct(p)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-[var(--color-text)] transition-colors hover:bg-[var(--color-border)]">
                        {p.image_url && <img src={p.image_url} alt="" className="size-10 flex-shrink-0 rounded-lg object-cover" />}
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{p.name}</p>
                          <p className="text-xs text-[var(--color-muted)]">{p.categories?.name}</p>
                        </div>
                      </button>
                    ))}
                    <button onClick={viewAllResults} className="mt-1 w-full rounded-lg px-3 py-2 text-center text-xs font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-border)]">
                      View all results
                    </button>
                  </>
                ) : (
                  <div className="px-3 py-4 text-center text-sm text-[var(--color-muted)]">No products found</div>
                )}
              </div>
            )}
          </div>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-[var(--color-success)] px-4 py-2 text-sm font-semibold text-white no-underline transition-opacity hover:opacity-90"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </a>
        </div>
      </nav>
    </header>
  )
}
