import { useState, useRef, useEffect, useCallback } from 'react'
import { api } from '../services/api'

let sessionId = crypto.randomUUID?.() || Math.random().toString(36).slice(2)

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [leadForm, setLeadForm] = useState(false)
  const [leadSent, setLeadSent] = useState(false)
  const leadNameRef = useRef(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'bot', text: 'Hi! I\'m the DPE assistant. Ask me about generators, engine parts, pricing, or anything else!' }])
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, leadForm])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)
    try {
      const { reply } = await api.chat.send(userMsg)
      setMessages((prev) => [...prev, { role: 'bot', text: reply, showLeadCta: true }])
    } catch {
      setMessages((prev) => [...prev, { role: 'bot', text: 'Sorry, something went wrong. Please try again or contact us directly.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleLeadSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    try {
      await api.inquiries.submit({
        name: form.name.value,
        phone: form.phone.value,
        email: form.email.value || undefined,
        message: 'Chat lead capture',
      })
      setLeadSent(true)
      setMessages((prev) => [...prev, { role: 'bot', text: `Thanks ${form.name.value}! A sales rep will call you soon.` }])
      setTimeout(() => { setLeadForm(false); setLeadSent(false) }, 2000)
    } catch { }
  }

  const openLeadForm = useCallback(() => {
    setLeadForm(true)
    setTimeout(() => leadNameRef.current?.focus(), 100)
  }, [])

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex w-80 sm:w-96 flex-col rounded-2xl border border-[var(--color-border)] bg-white shadow-2xl animate-fade-slide-in">
          <div className="flex items-center justify-between rounded-t-2xl bg-[var(--color-primary)] px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-full bg-white/20 text-sm font-bold">D</div>
              <div>
                <p className="text-sm font-semibold">DPE Assistant</p>
                <p className="text-[10px] opacity-80">Online</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-lg p-1 transition-colors hover:bg-white/20">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div className="flex h-80 flex-col gap-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div key={i}>
                <div className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'rounded-br-md bg-[var(--color-primary)] text-white'
                      : 'rounded-bl-md bg-[var(--color-bg)] text-[var(--color-text)]'
                  }`}>
                    {m.text}
                  </div>
                </div>
                {m.showLeadCta && !leadForm && !leadSent && (
                  <button onClick={openLeadForm}
                    className="mt-1.5 ml-1 rounded-full border border-[var(--color-primary)] px-3.5 py-1.5 text-xs font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/10">
                    📞 I&apos;d like a call back
                  </button>
                )}
              </div>
            ))}

            {leadForm && (
              <div className="rounded-2xl rounded-bl-md bg-[var(--color-bg)] p-4">
                <p className="mb-3 text-xs font-medium text-[var(--color-muted)]">Share your contact info so a sales rep can reach out:</p>
                <form onSubmit={handleLeadSubmit} className="space-y-2">
                  <input ref={leadNameRef} name="name" required placeholder="Your name"
                    className="w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-xs outline-none focus:border-[var(--color-primary)]" />
                  <input name="phone" required placeholder="Phone number"
                    className="w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-xs outline-none focus:border-[var(--color-primary)]" />
                  <input name="email" type="email" placeholder="Email (optional)"
                    className="w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-xs outline-none focus:border-[var(--color-primary)]" />
                  <button type="submit"
                    className="w-full rounded-lg bg-[var(--color-primary)] py-2 text-xs font-semibold text-white transition-colors hover:bg-[var(--color-primary-light)]">
                    Send — I'll get a call back
                  </button>
                </form>
              </div>
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md bg-[var(--color-bg)] px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="size-2 animate-bounce rounded-full bg-[var(--color-muted)]" style={{ animationDelay: '0ms' }} />
                    <div className="size-2 animate-bounce rounded-full bg-[var(--color-muted)]" style={{ animationDelay: '150ms' }} />
                    <div className="size-2 animate-bounce rounded-full bg-[var(--color-muted)]" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-[var(--color-border)] p-3">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." maxLength={500}
              className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm outline-none transition-all focus:border-[var(--color-primary)] focus:bg-white" />
            <button type="submit" disabled={loading || !input.trim()}
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white transition-all hover:bg-[var(--color-primary-light)] disabled:opacity-50">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </form>
        </div>
      )}

      <button onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-lg transition-all hover:bg-[var(--color-primary-light)] hover:scale-105 active:scale-95">
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
        )}
      </button>
    </>
  )
}
