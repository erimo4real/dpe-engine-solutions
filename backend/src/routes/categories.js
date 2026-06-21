import { Router } from 'express'
import { supabase } from '../config/supabase.js'
import { authMiddleware, requireAdmin } from '../middleware/auth.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
    if (error) return res.status(500).json({ error: 'Server error' })
    res.json({ categories: data })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { name, slug, sort_order } = req.body
    if (!name || !slug) {
      return res.status(400).json({ error: 'Name and slug required' })
    }
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name, slug, sort_order }])
      .select()
      .single()
    if (error) return res.status(500).json({ error: 'Server error' })
    res.status(201).json({ category: data })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.put('/:id', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { name, slug, sort_order } = req.body
    const { data, error } = await supabase
      .from('categories')
      .update({ name, slug, sort_order })
      .eq('id', req.params.id)
      .select()
      .single()
    if (error) return res.status(500).json({ error: 'Server error' })
    res.json({ category: data })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/:id', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', req.params.id)
    if (error) return res.status(500).json({ error: 'Server error' })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
