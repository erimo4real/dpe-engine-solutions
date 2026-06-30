import { Router } from 'express'
import { supabase } from '../config/supabase.js'
import { authMiddleware, requireAdmin } from '../middleware/auth.js'

const router = Router()

router.get('/', authMiddleware, requireAdmin, async (_req, res) => {
  try {
    const { data, error } = await supabase.from('settings').select('data').eq('id', 1).single()
    if (error) return res.status(500).json({ error: 'Failed to fetch settings' })
    res.json({ settings: data?.data || {} })
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

router.put('/', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .update({ data: req.body, updated_at: new Date().toISOString() })
      .eq('id', 1)
      .select('data')
      .single()
    if (error) return res.status(500).json({ error: 'Failed to update settings' })
    res.json({ settings: data?.data || {} })
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
