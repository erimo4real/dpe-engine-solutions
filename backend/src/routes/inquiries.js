import { Router } from 'express'
import { supabase } from '../config/supabase.js'
import { authMiddleware, requireAdmin } from '../middleware/auth.js'

const router = Router()

function sanitize(str) {
  if (!str) return str
  return str.replace(/<[^>]*>/g, '').trim()
}

router.post('/', async (req, res) => {
  try {
    const { name, phone, email, message } = req.body
    if (!name || !phone || !message) {
      return res.status(400).json({ error: 'Name, phone, and message required' })
    }

    const cleanName = sanitize(name)
    const cleanPhone = sanitize(phone)
    const cleanMessage = sanitize(message)
    const cleanEmail = email ? sanitize(email) : null

    if (cleanName.length < 2 || cleanName.length > 100) {
      return res.status(400).json({ error: 'Name must be between 2 and 100 characters' })
    }
    if (cleanPhone.length < 5 || cleanPhone.length > 30) {
      return res.status(400).json({ error: 'Invalid phone number' })
    }
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }
    if (cleanMessage.length < 5 || cleanMessage.length > 2000) {
      return res.status(400).json({ error: 'Message must be between 5 and 2000 characters' })
    }

    const { data, error } = await supabase
      .from('inquiries')
      .insert([{ name: cleanName, phone: cleanPhone, email: cleanEmail, message: cleanMessage, status: 'new' }])
      .select()
      .single()
    if (error) return res.status(500).json({ error: 'Server error' })
    res.status(201).json({ inquiry: data })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: 'Server error' })
    res.json({ inquiries: data })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.put('/:id', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body
    const validStatuses = ['new', 'read', 'replied', 'archived', 'spam']
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }
    const updateFields = { status }
    if (status === 'read' || status === 'replied') {
      updateFields.read_at = new Date().toISOString()
    }
    const { data, error } = await supabase
      .from('inquiries')
      .update(updateFields)
      .eq('id', req.params.id)
      .select()
      .single()
    if (error) return res.status(500).json({ error: 'Server error' })
    res.json({ inquiry: data })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/:id', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', req.params.id)
    if (error) return res.status(500).json({ error: 'Server error' })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
