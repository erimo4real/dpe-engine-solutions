import ProductCard from '../components/ProductCard'
import CTASection from '../components/CTASection'

const generators = [
  { name: '5KVA Generator', description: 'Compact home backup generator. Fuel-efficient and quiet operation.', specs: ['Petrol or Diesel options', 'Single phase output', 'Low noise enclosure', 'Automatic voltage regulation'] },
  { name: '7.5KVA Generator', description: 'Mid-range power for small shops and apartments.', specs: ['Diesel engine', 'Single phase', 'Electric start', 'Compact footprint'] },
  { name: '10KVA Generator', description: 'Reliable power for small businesses and larger homes.', specs: ['Diesel', 'Three phase ready', 'Auto start/transfer switch', 'Heavy-duty alternator'] },
  { name: '15KVA Generator', description: 'Commercial-grade generator for offices and workshops.', specs: ['Diesel', 'Three phase', 'Deep oil sump', 'Industrial muffler'] },
  { name: '20KVA Generator', description: 'Heavy-duty power solution for industrial use.', specs: ['Diesel', 'Three phase', 'Continuous rating', 'Remote monitoring ready'] },
]

const parts = [
  { name: 'Engine Cylinder Heads', description: 'New and reconditioned cylinder heads for popular generator brands.', specs: ['Brands: Perkins, Lister, Deutz', 'Pressure tested', 'Valve grind included'] },
  { name: 'Alternator Parts', description: 'AVR boards, diodes, bearings, and complete alternator assemblies.', specs: ['Stamford, Leroy-Somer', 'New & refurbished', 'Warranty included'] },
  { name: 'Fuel System Components', description: 'Injectors, pumps, filters, and fuel lines for diesel generators.', specs: ['Genuine & OEM options', 'Calibration service', 'Lagos-wide delivery'] },
  { name: 'Control Panels & Sensors', description: 'Deep Sea, Datakom, and SmartGen controller units.', specs: ['Automatic & manual models', 'Installation available', 'Programming included'] },
]

export default function Products() {
  return (
    <>
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-3 text-[clamp(1.8rem,3.5vw,3rem)] font-bold">Our Products</h1>
          <p className="mx-auto max-w-2xl text-sm text-[var(--color-muted)]">
            Explore our range of generators and genuine engine parts. All items are sourced from trusted suppliers.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-xl font-bold">Generators</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {generators.map((g) => (
              <ProductCard key={g.name} {...g} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-surface)] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-xl font-bold">Engine Parts</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {parts.map((p) => (
              <ProductCard key={p.name} {...p} />
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Don&apos;t See What You Need?"
        subtitle="We can source any generator or part. Contact us with your requirements and we'll get back to you fast."
      />
    </>
  )
}
