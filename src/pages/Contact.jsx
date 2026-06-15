import { useState } from 'react'
import CTASection from '../components/CTASection'
import { WHATSAPP_NUMBER, PHONE_NUMBER, PHONE_DISPLAY, EMAIL } from '../constants'

const contactInfo = [
  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>, label: 'Call Us', value: PHONE_DISPLAY, href: `tel:${PHONE_NUMBER}` },
  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>, label: 'WhatsApp', value: 'Chat with us', href: `https://wa.me/${WHATSAPP_NUMBER}` },
  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, label: 'Email', value: EMAIL, href: `mailto:${EMAIL}` },
]

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-3 text-[clamp(1.8rem,3.5vw,3rem)] font-bold">Contact Us</h1>
          <p className="mx-auto max-w-2xl text-sm text-[var(--color-muted)]">
            Reach out via call, WhatsApp, email, or drop us a message below.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-xl font-bold">Get In Touch</h2>
              <div className="space-y-4">
                {contactInfo.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 no-underline transition-shadow hover:shadow-md"
                  >
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-[var(--color-muted)]">{item.label}</div>
                      <div className="text-sm font-semibold text-[var(--color-text)]">{item.value}</div>
                    </div>
                  </a>
                ))}
              </div>

              <div className="mt-8">
                <h2 className="mb-4 text-xl font-bold">Send a Message</h2>
                {submitted ? (
                  <div className="rounded-xl border border-[var(--color-success)]/30 bg-[var(--color-success)]/5 p-6 text-center">
                    <p className="font-semibold text-[var(--color-success)]">Thank you! We&apos;ll get back to you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="mb-1 block text-sm font-medium">Full Name</label>
                      <input
                        id="name"
                        type="text"
                        required
                        className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-primary)]"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="mb-1 block text-sm font-medium">Phone Number</label>
                      <input
                        id="phone"
                        type="tel"
                        required
                        className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-primary)]"
                        placeholder="080 XXX XXXX"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="mb-1 block text-sm font-medium">Message</label>
                      <textarea
                        id="message"
                        rows={4}
                        required
                        className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-primary)]"
                        placeholder="How can we help you?"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full rounded-lg bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[var(--color-primary-light)]"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-bold">Our Service Area</h2>
              <div className="overflow-hidden rounded-xl border border-[var(--color-border)]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126916.74105271547!2d3.2934169!3d6.5243793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b9228fa2a399d%3A0x5e2c3b5b5b5b5b5b!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2s!4v1"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lagos Service Area Map"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Call or WhatsApp Us Directly"
        subtitle="We respond faster on WhatsApp. Message us now for instant assistance."
      />
    </>
  )
}
