import { Router } from 'express'
import { supabase } from '../config/supabase.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { name, phone, email, message } = req.body
    if (!name || !phone || !message) {
      return res.status(400).json({ error: 'Name, phone, and message required' })
    }
    const { data, error } = await supabase
      .from('inquiries')
      .insert([{ name, phone, email, message, status: 'new' }])
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    res.status(201).json({ inquiry: data })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    res.json({ inquiries: data })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body
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
    if (error) return res.status(500).json({ error: error.message })
    res.json({ inquiry: data })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', req.params.id)
    if (error) return res.status(500).json({ error: error.message })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
