import { Router } from 'express'
import { supabase } from '../config/supabase.js'
import { authMiddleware } from '../middleware/auth.js'
import { deleteCloudinaryImage } from '../config/cloudinary.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const { category: categorySlug, search: searchQuery } = req.query
    let query = supabase
      .from('products')
      .select('*, categories!inner(name, slug)')
      .order('sort_order', { ascending: true })

    if (categorySlug) {
      query = query.eq('categories.slug', categorySlug)
    }

    if (searchQuery) {
      const pattern = `%${searchQuery}%`
      query = query.ilike('name', pattern)
    }

    const { data, error } = await query
    if (error) return res.status(500).json({ error: error.message })
    res.json({ products: data })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name, slug)')
      .eq('id', req.params.id)
      .single()
    if (error) return res.status(404).json({ error: 'Product not found' })
    res.json({ product: data })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, specs, image_url, category_id, sort_order } = req.body
    if (!name || !category_id) {
      return res.status(400).json({ error: 'Name and category_id required' })
    }
    const { data, error } = await supabase
      .from('products')
      .insert([{ name, description, specs, image_url, category_id, sort_order }])
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    res.status(201).json({ product: data })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, description, specs, image_url, category_id, sort_order } = req.body

    const { data: existing } = await supabase
      .from('products')
      .select('image_url')
      .eq('id', req.params.id)
      .single()

    if (existing && existing.image_url && existing.image_url !== image_url) {
      await deleteCloudinaryImage(existing.image_url)
    }

    const { data, error } = await supabase
      .from('products')
      .update({ name, description, specs, image_url, category_id, sort_order })
      .eq('id', req.params.id)
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    res.json({ product: data })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { data: existing } = await supabase
      .from('products')
      .select('image_url')
      .eq('id', req.params.id)
      .single()

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id)
    if (error) return res.status(500).json({ error: error.message })

    if (existing?.image_url) {
      await deleteCloudinaryImage(existing.image_url)
    }

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
