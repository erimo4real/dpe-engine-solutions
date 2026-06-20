import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import CTASection from '../components/CTASection'
import HeroCarousel from '../components/HeroCarousel'
import useInView from '../hooks/useInView'
import { COMPANY_NAME, SITE_DESCRIPTION, SITE_URL } from '../constants'

const features = [
  { title: '10+ Years Experience', desc: 'Deep expertise in generator sales, servicing, and parts supply across Lagos.', icon: '<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>' },
  { title: 'Genuine Parts Guaranteed', desc: 'We source only authentic engine parts and components for reliability.', icon: '<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>' },
  { title: 'Fast Lagos-wide Service', desc: 'Quick response and delivery across all Lagos mainland and island areas.', icon: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>' },
  { title: 'Competitive Pricing', desc: 'Fair market rates with no hidden charges. Call for the best prices.', icon: '<path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>' },
]

const featuredProducts = [
  { name: '5KVA Generator', img: '/images/firema5kv.webp', desc: 'Compact, fuel-efficient. Ideal for home backup.', specs: ['Petrol/Diesel', 'Single phase', 'Low noise'], price: '₦250K - ₦400K' },
  { name: '10KVA Generator', img: '/images/Sumecfireman10sp.jpg', desc: 'Perfect for small businesses.', specs: ['Diesel', 'Three phase ready', 'Auto start'], price: '₦600K - ₦900K' },
  { name: '20KVA Generator', img: '/images/20kvgenerator.jpg', desc: 'Heavy-duty for commercial use.', specs: ['Diesel', 'Three phase', 'Industrial grade'], price: '₦1.5M - ₦2.5M' },
]

const highlights = [
  { value: '500+', label: 'Generators Supplied' },
  { value: '10+', label: 'Years Experience' },
  { value: '1000+', label: 'Repairs Completed' },
  { value: '12', label: 'Lagos Areas Covered' },
]

function AnimatedSection({ children, className = '' }) {
  const [ref, inView] = useInView({})
  return <div ref={ref} className={`transition-all duration-700 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${className}`}>{children}</div>
}

export default function Home() {
  const [heroRef, heroIn] = useInView({ threshold: 0 })

  return (
    <>
      <Helmet>
        <title>{COMPANY_NAME}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        <meta property="og:title" content={COMPANY_NAME} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:url" content={SITE_URL} />
      </Helmet>
      <HeroCarousel />

      <section className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div ref={heroRef} className={`mb-16 text-center transition-all duration-700 ${heroIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <span className="inline-block rounded-full bg-[var(--color-primary)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">Why DPE</span>
            <h2 className="mt-4 text-[clamp(1.5rem,3vw,2.5rem)] font-bold">Why Choose Us</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--color-muted)]">
              We bridge the gap between industrial suppliers and buyers across Lagos with speed and trust.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <AnimatedSection key={f.title}>
                <div className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] transition-colors group-hover:bg-[var(--color-primary)] group-hover:text-white">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: f.icon.slice(6, -7) }} />
                  </div>
                  <h3 className="mb-2 text-base font-bold">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-[var(--color-muted)]">{f.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-surface)] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-14 text-center">
            <span className="inline-block rounded-full bg-[var(--color-secondary)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-secondary)]">Best Sellers</span>
            <h2 className="mt-4 text-[clamp(1.5rem,3vw,2.5rem)] font-bold">Featured Generators</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--color-muted)]">
              Popular choices for homes and businesses. All prices available on request.
            </p>
          </AnimatedSection>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((p, i) => (
              <AnimatedSection key={p.name}>
                <div className="group overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div className="aspect-[4/3] overflow-hidden bg-[var(--color-bg)]">
                    <img src={p.img} alt={p.name} className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110" loading={i === 0 ? 'eager' : 'lazy'} />
                  </div>
                  <div className="p-6">
                    <div className="mb-1 flex items-center justify-between">
                      <h3 className="text-lg font-bold">{p.name}</h3>
                      <span className="rounded-full bg-[var(--color-secondary)]/10 px-3 py-1 text-xs font-semibold text-[var(--color-secondary)]">{p.price}</span>
                    </div>
                    <p className="mb-4 text-sm text-[var(--color-muted)]">{p.desc}</p>
                    <ul className="mb-5 space-y-1.5 text-sm">
                      {p.specs.map((s, j) => (
                        <li key={j} className="flex items-center gap-2">
                          <span className="size-1.5 rounded-full bg-[var(--color-secondary)]" />
                          {s}
                        </li>
                      ))}
                    </ul>
                    <Link to="/products" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white no-underline shadow-sm transition-all hover:bg-[var(--color-primary-light)] hover:shadow-md">
                      View Details
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--color-primary)] py-20 sm:py-28">
        <div className="absolute inset-0 opacity-5"><div className="absolute -left-20 -top-20 size-80 rounded-full bg-white" /><div className="absolute -bottom-20 -right-20 size-96 rounded-full bg-white" /></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-10 text-center text-white lg:grid-cols-4">
            {highlights.map((h, i) => (
              <div key={h.label} className={`transition-all duration-700 ${heroIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: `${i * 150}ms` }}>
                <div className="text-[clamp(1.8rem,3vw,2.5rem)] font-extrabold">{h.value}</div>
                <div className="mt-1 text-sm font-medium opacity-80">{h.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center">
            <span className="inline-block rounded-full bg-[var(--color-primary)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">Our Process</span>
            <h2 className="mt-4 text-[clamp(1.5rem,3vw,2.5rem)] font-bold">How It Works</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--color-muted)]">
              From inquiry to delivery, we keep it simple.
            </p>
          </AnimatedSection>
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {[
              { step: '01', title: 'Contact Us', desc: 'Call or WhatsApp us with your requirements. We respond within minutes.' },
              { step: '02', title: 'We Source & Quote', desc: 'We check availability, get the best price, and send you a quote same day.' },
              { step: '03', title: 'Delivery & Support', desc: 'We deliver to your location and provide after-sales support.' },
            ].map((s) => (
              <AnimatedSection key={s.step}>
                <div className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[var(--color-primary)] text-lg font-bold text-white shadow-sm transition-all group-hover:scale-110">{s.step}</div>
                  <h3 className="mb-2 text-base font-bold">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-[var(--color-muted)]">{s.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <CTASection title="Ready to Get Started?" subtitle="Call or WhatsApp us for inquiries on generators, parts, and servicing. We respond fast." />
    </>
  )
}
