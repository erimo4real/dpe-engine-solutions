import { useState, useEffect } from 'react'
import { api } from '../services/api'

const DEFAULTS = {
  business_name: '',
  business_hours: '',
  address: '',
  phone: '',
  email: '',
  bank_name: '',
  account_name: '',
  account_number: '',
  payment_methods: '',
  delivery_areas: '',
  delivery_fee: '',
  lead_time: '',
  pricing_notes: '',
  openai_key: '',
  whatsapp_number: '',
  twilio_account_sid: '',
  twilio_auth_token: '',
}

export default function AdminSettings() {
  const [form, setForm] = useState(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const { settings } = await api.settings.get()
        setForm({ ...DEFAULTS, ...settings })
      } catch { } finally { setLoading(false) }
    })()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      await api.settings.update(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch { } finally { setSaving(false) }
  }

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  if (loading) {
    return (
      <div className="animate-fade-slide-in">
        <div className="mb-6"><h1 className="text-2xl font-bold text-[var(--color-text)]">Settings</h1></div>
        <div className="flex justify-center py-16"><div className="size-8 animate-spin rounded-full border-3 border-[var(--color-border)] border-t-[var(--color-primary)]" /></div>
      </div>
    )
  }

  const Section = ({ title, children }) => (
    <div className="rounded-xl border border-[var(--color-border)] bg-white p-6">
      <h2 className="mb-4 text-sm font-bold text-[var(--color-text)]">{title}</h2>
      <div className="space-y-3.5">{children}</div>
    </div>
  )

  const Field = ({ label, value, onChange, type = 'text', placeholder, note }) => (
    <div>
      <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">{label}</label>
      {type === 'textarea' ? (
        <textarea rows={3} value={value} onChange={onChange} placeholder={placeholder}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm outline-none transition-all focus:border-[var(--color-primary)] focus:bg-white" />
      ) : (
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm outline-none transition-all focus:border-[var(--color-primary)] focus:bg-white" />
      )}
      {note && <p className="mt-1 text-[11px] text-[var(--color-muted)]">{note}</p>}
    </div>
  )

  return (
    <div className="animate-fade-slide-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Settings</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">Business info used by the chatbot to answer visitor questions</p>
        </div>
        {saved && <span className="rounded-lg bg-[var(--color-success)]/10 px-3 py-1.5 text-sm font-medium text-[var(--color-success)]">Saved!</span>}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Section title="Business Information">
          <Field label="Business Name" value={form.business_name} onChange={set('business_name')} placeholder="DPE Engine Solutions" />
          <Field label="Business Hours" value={form.business_hours} onChange={set('business_hours')} placeholder="Mon–Fri 8am–6pm, Sat 9am–4pm" />
          <Field label="Address" value={form.address} onChange={set('address')} placeholder="123 Industrial Area, Lagos" />
          <Field label="Phone" value={form.phone} onChange={set('phone')} placeholder="+2348130812073" />
          <Field label="Email" value={form.email} onChange={set('email')} type="email" placeholder="danielprince308120@gmail.com" />
        </Section>

        <Section title="Payment Information">
          <Field label="Bank Name" value={form.bank_name} onChange={set('bank_name')} placeholder="GTBank" />
          <Field label="Account Name" value={form.account_name} onChange={set('account_name')} placeholder="Daniel Prince" />
          <Field label="Account Number" value={form.account_number} onChange={set('account_number')} placeholder="0123456789" />
          <Field label="Payment Methods Accepted" value={form.payment_methods} onChange={set('payment_methods')} placeholder="Bank transfer, POS, USSD" />
        </Section>

        <Section title="Delivery">
          <Field label="Delivery Areas" value={form.delivery_areas} onChange={set('delivery_areas')} placeholder="Lagos mainland, Ikeja, VI, Lekki" />
          <Field label="Delivery Fee" value={form.delivery_fee} onChange={set('delivery_fee')} placeholder="₦5,000 – ₦20,000 depending on location" />
          <Field label="Lead Time" value={form.lead_time} onChange={set('lead_time')} placeholder="1–3 business days" />
        </Section>

        <Section title="Pricing">
          <Field label="Pricing Notes" value={form.pricing_notes} onChange={set('pricing_notes')} type="textarea" placeholder="Generators from ₦500k. Contact for custom quotes on large units." />
        </Section>

        <Section title="AI Chatbot">
          <Field label="OpenAI API Key" value={form.openai_key} onChange={set('openai_key')} type="password" placeholder="sk-..." note="Powers AI responses. Get one at platform.openai.com" />
        </Section>

        <Section title="WhatsApp Integration">
          <Field label="WhatsApp Business Number" value={form.whatsapp_number} onChange={set('whatsapp_number')} placeholder="+2348130812073" note="Your WhatsApp Business number (with country code)" />
          <Field label="Twilio Account SID" value={form.twilio_account_sid} onChange={set('twilio_account_sid')} type="password" placeholder="AC..." />
          <Field label="Twilio Auth Token" value={form.twilio_auth_token} onChange={set('twilio_auth_token')} type="password" placeholder="..." />
        </Section>

        <div className="flex justify-end gap-3">
          <button type="submit" disabled={saving}
            className="rounded-lg bg-[var(--color-primary)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--color-primary-light)] hover:shadow-md disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}
