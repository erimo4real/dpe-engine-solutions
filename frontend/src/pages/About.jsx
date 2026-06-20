import { Helmet } from 'react-helmet-async'
import CTASection from '../components/CTASection'
import useInView from '../hooks/useInView'
import { COMPANY_NAME } from '../constants'

const stats = [
  { value: '500+', label: 'Generators Supplied' },
  { value: '10+', label: 'Years Experience' },
  { value: '1000+', label: 'Repairs Completed' },
  { value: '8', label: 'Lagos Locations Covered' },
]

const team = [
  { name: 'Prince Daniel', role: 'Founder & Lead Engineer', initials: 'PD' },
  { name: 'Engineer Team', role: 'Technical & Repairs', initials: 'ET' },
  { name: 'Logistics Team', role: 'Delivery & Support', initials: 'LT' },
]

function AnimatedSection({ children, className = '' }) {
  const [ref, inView] = useInView({})
  return <div ref={ref} className={`transition-all duration-700 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${className}`}>{children}</div>
}

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us | {COMPANY_NAME}</title>
        <meta name="description" content={`Learn about ${COMPANY_NAME}. With over 10 years of experience in generator sales, parts supply, and servicing across Lagos.`} />
      </Helmet>
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-block rounded-full bg-[var(--color-primary)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">Our Story</span>
          <h1 className="mt-4 text-[clamp(1.8rem,3.5vw,3rem)] font-bold">About Us</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--color-muted)]">
            Who we are and why Lagos businesses trust us for their power needs.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <AnimatedSection>
              <h2 className="mb-6 text-[clamp(1.3rem,2.5vw,2rem)] font-bold">Your Trusted Power Partner in Lagos</h2>
            </AnimatedSection>
            <AnimatedSection>
              <div className="space-y-5 text-sm leading-relaxed text-[var(--color-muted)]">
                <p>
                  Daniel Prince Engineer was founded to solve a simple problem: businesses and homeowners in Lagos
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
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--color-primary)] py-16 text-white">
        <div className="absolute inset-0 opacity-5"><div className="absolute -left-20 -top-20 size-80 rounded-full bg-white" /><div className="absolute -bottom-20 -right-20 size-96 rounded-full bg-white" /></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-10 text-center lg:grid-cols-4">
            {stats.map((s, i) => (
              <div key={s.label} className="transition-all duration-700" style={{ transitionDelay: `${i * 150}ms` }}>
                <div className="text-[clamp(1.8rem,3vw,2.5rem)] font-extrabold">{s.value}</div>
                <div className="mt-1 text-sm font-medium opacity-80">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-10 text-center">
            <span className="inline-block rounded-full bg-[var(--color-secondary)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-secondary)]">Our Team</span>
            <h2 className="mt-4 text-[clamp(1.3rem,2.5vw,2rem)] font-bold">Meet the Team</h2>
          </AnimatedSection>
          <div className="grid gap-6 sm:grid-cols-3">
            {team.map((t) => (
              <AnimatedSection key={t.name}>
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-lg font-bold text-[var(--color-primary)]">{t.initials}</div>
                  <h3 className="text-base font-bold">{t.name}</h3>
                  <p className="mt-1 text-xs text-[var(--color-muted)]">{t.role}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <CTASection title="Have Questions?" subtitle="We're ready to help. Reach out via call or WhatsApp for fast, friendly service." />
    </>
  )
}
