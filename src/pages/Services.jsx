import ServiceCard from '../components/ServiceCard'
import CTASection from '../components/CTASection'

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

export default function Services() {
  return (
    <>
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-3 text-[clamp(1.8rem,3.5vw,3rem)] font-bold">Our Services</h1>
          <p className="mx-auto max-w-2xl text-sm text-[var(--color-muted)]">
            End-to-end generator and power solutions across Lagos. From repair to delivery, we handle it all.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2">
            {services.map((s) => (
              <ServiceCard key={s.title} {...s} />
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
