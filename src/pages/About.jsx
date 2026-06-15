import CTASection from '../components/CTASection'

const stats = [
  { value: '500+', label: 'Generators Supplied' },
  { value: '10+', label: 'Years Experience' },
  { value: '1000+', label: 'Repairs Completed' },
  { value: '8', label: 'Lagos Locations Covered' },
]

export default function About() {
  return (
    <>
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-3 text-[clamp(1.8rem,3.5vw,3rem)] font-bold">About Us</h1>
          <p className="mx-auto max-w-2xl text-sm text-[var(--color-muted)]">
            Who we are and why Lagos businesses trust us for their power needs.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-4 text-[clamp(1.3rem,2.5vw,2rem)] font-bold">Your Trusted Power Partner in Lagos</h2>
            <div className="space-y-4 text-sm leading-relaxed text-[var(--color-muted)]">
              <p>
                Lagos Power Solutions was founded to solve a simple problem: businesses and homeowners in Lagos
                struggle to find reliable generator suppliers, genuine parts, and skilled technicians they can trust.
              </p>
              <p>
                With over a decade of hands-on experience in the industrial power sector, we&apos;ve built strong
                relationships with manufacturers and suppliers. This allows us to source quality generators and
                engine parts at competitive prices, passing the savings on to our customers.
              </p>
              <p>
                Our team of certified technicians handles everything from routine servicing to complex generator
                overhauls. We serve residential customers, small businesses, facility managers, and industrial
                buyers across all Lagos — from Ikeja to Lekki, Victoria Island to Apapa.
              </p>
              <p>
                Unlike large corporate suppliers, we move fast. When you call or WhatsApp us, you speak directly
                to someone who can source, price, and deliver. No delays, no bureaucracy.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-primary)] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-[clamp(1.8rem,3vw,2.5rem)] font-extrabold">{s.value}</div>
                <div className="text-sm opacity-80">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-4 text-[clamp(1.3rem,2.5vw,2rem)] font-bold">Our Service Areas</h2>
            <p className="mb-6 text-sm leading-relaxed text-[var(--color-muted)]">
              We cover all major areas across Lagos with fast response and delivery times.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {['Ikeja', 'Lekki', 'Victoria Island', 'Apapa', 'Surulere', 'Yaba', 'Gbagada', 'Oshodi', 'Agege', 'Ikorodu', 'Epe', 'Badagry'].map((area) => (
                <div key={area} className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" aria-hidden="true"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  {area}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Have Questions?"
        subtitle="We're ready to help. Reach out via call or WhatsApp for fast, friendly service."
      />
    </>
  )
}
