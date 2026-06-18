import { Link } from 'react-router-dom'
import CTASection from '../components/CTASection'
import HeroCarousel from '../components/HeroCarousel'

const features = [
  { title: '10+ Years Experience', desc: 'Deep expertise in generator sales, servicing, and parts supply across Lagos.' },
  { title: 'Genuine Parts Guaranteed', desc: 'We source only authentic engine parts and components for reliability.' },
  { title: 'Fast Lagos-wide Service', desc: 'Quick response and delivery across all Lagos mainland and island areas.' },
  { title: 'Competitive Pricing', desc: 'Fair market rates with no hidden charges. Call for the best prices.' },
]

const featuredProducts = [
  { name: '5KVA Generator', img: '/images/firema5kv.webp', desc: 'Ideal for home backup. Compact, fuel-efficient, reliable.', specs: ['Petrol/Diesel', 'Single phase', 'Low noise'] },
  { name: '10KVA Generator', img: '/images/Sumecfireman10sp.jpg', desc: 'Perfect for small businesses. Robust performance.', specs: ['Diesel', 'Three phase ready', 'Auto start'] },
  { name: '20KVA Generator', img: '/images/20kvgenerator.jpg', desc: 'For commercial use. Heavy-duty continuous operation.', specs: ['Diesel', 'Three phase', 'Industrial grade'] },
]

export default function Home() {
  return (
    <>
      <HeroCarousel />

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
              <div key={p.name} className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="aspect-[4/3] overflow-hidden bg-[var(--color-bg)]">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
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
