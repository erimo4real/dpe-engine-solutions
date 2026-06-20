import { Helmet } from 'react-helmet-async'
import ServiceCard from '../components/ServiceCard'
import CTASection from '../components/CTASection'
import useInView from '../hooks/useInView'
import { COMPANY_NAME } from '../constants'

const services = [
  {
    title: 'Generator Repair',
    description: 'Fast, reliable diagnosis and repair for all generator brands and models. Our experienced technicians handle everything from minor faults to complete overhauls.',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" strokeWidth="2" aria-hidden="true"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
  },
  {
    title: 'Servicing & Cleaning',
    description: 'Routine maintenance including oil changes, filter replacements, coolant top-ups, and thorough cleaning to extend generator life and ensure peak performance.',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" strokeWidth="2" aria-hidden="true"><path d="M3 3v18h18"/><path d="M7 16l4-8 4 4 4-8"/></svg>,
  },
  {
    title: 'Installation Services',
    description: 'Professional generator installation including site assessment, slab preparation, exhaust routing, fuel line connection, and automatic transfer switch wiring.',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" strokeWidth="2" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  },
  {
    title: 'Logistics & Delivery',
    description: 'Safe and timely delivery of generators and parts across Lagos mainland and island. We handle loading, transport, and offloading at your location.',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" strokeWidth="2" aria-hidden="true"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  },
]

function AnimatedSection({ children, className = '' }) {
  const [ref, inView] = useInView({})
  return <div ref={ref} className={`transition-all duration-700 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${className}`}>{children}</div>
}

export default function Services() {
  return (
    <>
      <Helmet>
        <title>Services | {COMPANY_NAME}</title>
        <meta name="description" content="Generator repair, servicing, installation, and delivery services across Lagos. Fast response and professional work by experienced technicians." />
      </Helmet>
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-block rounded-full bg-[var(--color-secondary)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-secondary)]">What We Do</span>
          <h1 className="mt-4 text-[clamp(1.8rem,3.5vw,3rem)] font-bold">Our Services</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--color-muted)]">
            End-to-end generator and power solutions across Lagos. From repair to delivery, we handle it all.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2">
            {services.map((s, i) => (
              <AnimatedSection key={s.title}>
                <ServiceCard {...s} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-surface)] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center">
            <span className="inline-block rounded-full bg-[var(--color-primary)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">Service Areas</span>
            <h2 className="mt-4 text-[clamp(1.5rem,3vw,2.5rem)] font-bold">Where We Serve</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--color-muted)]">
              Fast response across all major Lagos areas.
            </p>
          </AnimatedSection>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {['Ikeja', 'Lekki', 'Victoria Island', 'Apapa', 'Surulere', 'Yaba', 'Gbagada', 'Oshodi', 'Agege', 'Ikorodu', 'Epe', 'Badagry'].map((area) => (
              <div key={area} className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm shadow-sm transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" aria-hidden="true"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                {area}
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Need a Service Emergency?"
        subtitle="We offer priority response for urgent repairs and breakdowns. Call or WhatsApp us now."
      />
    </>
  )
}
