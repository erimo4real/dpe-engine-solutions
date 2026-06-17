import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { WHATSAPP_NUMBER, PHONE_NUMBER, COMPANY_NAME } from '../constants'

const slides = [
  {
    img: '/images/slide1-generator.jpg',
    title: 'Reliable Generators for Every Need',
    subtitle: 'From 5KVA homesets to 20KVA industrial units — we supply, install, and maintain.',
    cta: { label: 'View Generators', to: '/products' },
  },
  {
    img: '/images/slide2-engine-parts.jpg',
    title: 'Genuine Engine Parts Supplied',
    subtitle: 'Cylinder heads, alternator parts, fuel systems, and control panels. New & reconditioned.',
    cta: { label: 'Browse Parts', to: '/products' },
  },
  {
    img: '/images/slide3-repair.jpg',
    title: 'Expert Generator Repairs',
    subtitle: 'Fast diagnosis and repair by experienced technicians. Minor fixes to complete overhauls.',
    cta: { label: 'Request Service', to: '/services' },
  },
  {
    img: '/images/slide4-servicing.jpg',
    title: 'Servicing & Cleaning',
    subtitle: 'Routine maintenance to extend generator life. Oil changes, filter replacements, and more.',
    cta: { label: 'Book a Service', to: '/services' },
  },
  {
    img: '/images/slide5-team.jpg',
    title: `${COMPANY_NAME}`,
    subtitle: 'Lagos trusted partner for generator sales, parts, repair, and logistics support.',
    cta: { label: 'Contact Us', to: '/contact' },
  },
]

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length)
  }, [])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <section className="relative h-[70vh] min-h-[400px] overflow-hidden sm:h-[80vh]">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <img
            src={slide.img}
            alt={slide.title}
            className="h-full w-full object-cover"
            loading={i === 0 ? 'eager' : 'lazy'}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/80 via-[var(--color-primary)]/50 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-xl">
                <h1 className="mb-4 text-[clamp(1.6rem,4vw,3.2rem)] font-extrabold leading-tight text-white">
                  {slide.title}
                </h1>
                <p className="mb-6 text-sm leading-relaxed text-white/80 sm:text-base">
                  {slide.subtitle}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to={slide.cta.to}
                    className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-secondary)] px-6 py-3 text-sm font-bold text-white no-underline transition-all hover:bg-[var(--color-secondary-light)]"
                  >
                    {slide.cta.label}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-6 py-3 text-sm font-bold text-white no-underline backdrop-blur-sm transition-all hover:bg-white/20"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all hover:bg-white/30"
        aria-label="Previous slide"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all hover:bg-white/30"
        aria-label="Next slide"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
      </button>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`size-2.5 rounded-full transition-all ${
              i === current ? 'w-8 bg-[var(--color-secondary)]' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
