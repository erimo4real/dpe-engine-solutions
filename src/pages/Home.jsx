import { Link } from 'react-router-dom'
import CTASection from '../components/CTASection'

const features = [
  { title: '10+ Years Experience', desc: 'Deep expertise in generator sales, servicing, and parts supply across Lagos.' },
  { title: 'Genuine Parts Guaranteed', desc: 'We source only authentic engine parts and components for reliability.' },
  { title: 'Fast Lagos-wide Service', desc: 'Quick response and delivery across all Lagos mainland and island areas.' },
  { title: 'Competitive Pricing', desc: 'Fair market rates with no hidden charges. Call for the best prices.' },
]

const featuredProducts = [
  { name: '5KVA Generator', desc: 'Ideal for home backup. Compact, fuel-efficient, reliable.', specs: ['Petrol/Diesel', 'Single phase', 'Low noise'] },
  { name: '10KVA Generator', desc: 'Perfect for small businesses. Robust performance.', specs: ['Diesel', 'Three phase ready', 'Auto start'] },
  { name: '20KVA Generator', desc: 'For commercial use. Heavy-duty continuous operation.', specs: ['Diesel', 'Three phase', 'Industrial grade'] },
]

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-[var(--color-primary)] py-20 text-white sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(217,119,6,0.15),transparent_60%)]" />
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-4 text-[clamp(2rem,5vw,4rem)] font-extrabold leading-[1.1] tracking-tight">
            Power That Never Quits
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed opacity-80 sm:text-lg">
            Lagos&apos; trusted source for generator sales, genuine engine parts, and expert maintenance services. Fast response. Fair prices. Reliable delivery.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-secondary)] px-6 py-3 text-sm font-bold text-white no-underline transition-all hover:bg-[var(--color-secondary-light)]"
            >
              View Products
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <a
              href="tel:+2348000000000"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white no-underline backdrop-blur-sm transition-all hover:bg-white/20"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
              Call +234 800 000 0000
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-[clamp(1.5rem,3vw,2.5rem)] font-bold">Why Choose Us</h2>
            <p className="mx-auto max-w-xl text-sm text-[var(--color-muted)]">
              We bridge the gap between industrial suppliers and buyers across Lagos with speed and trust.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center shadow-sm">
                <h3 className="mb-2 text-base font-bold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--color-muted)]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-surface)] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-[clamp(1.5rem,3vw,2.5rem)] font-bold">Featured Generators</h2>
            <p className="mx-auto max-w-xl text-sm text-[var(--color-muted)]">
              Popular choices for homes and businesses. All prices available on request.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((p) => (
              <div key={p.name} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6 shadow-sm">
                <h3 className="mb-2 text-lg font-bold">{p.name}</h3>
                <p className="mb-3 text-sm text-[var(--color-muted)]">{p.desc}</p>
                <ul className="mb-4 space-y-1 text-sm">
                  {p.specs.map((s, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-[var(--color-secondary)]" />
                      {s}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[var(--color-accent)]">Call for price</span>
                  <Link to="/products" className="text-sm font-semibold text-[var(--color-primary)] no-underline hover:underline">
                    View All &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to Get Started?"
        subtitle="Call or WhatsApp us for inquiries on generators, parts, and servicing. We respond fast."
      />
    </>
  )
}
