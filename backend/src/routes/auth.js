import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { supabase } from '../config/supabase.js'
import { generateToken, authMiddleware, cookieOptions } from '../middleware/auth.js'
import { deleteCloudinaryImage } from '../config/cloudinary.js'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'

const router = Router()

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' })
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single()

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = generateToken(user.id, user.token_version)
    res.cookie('token', token, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })

    res.json({ success: true, user: { id: user.id, username: user.username, email: user.email, full_name: user.full_name } })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/logout', (_, res) => {
  res.clearCookie('token', cookieOptions)
  res.json({ success: true })
})

router.put('/password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password required' })
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' })
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.userId)
      .single()

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const valid = await bcrypt.compare(currentPassword, user.password_hash)
    if (!valid) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }

    const hash = await bcrypt.hash(newPassword, 10)
    const { data: currentUser } = await supabase
      .from('users')
      .select('token_version')
      .eq('id', req.userId)
      .single()
    const newVersion = (currentUser?.token_version || 0) + 1
    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash: hash, token_version: newVersion })
      .eq('id', req.userId)

    if (updateError) return res.status(500).json({ error: updateError.message })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/forgot-password', async (req, res) => {
  try {
    const { username } = req.body
    if (!username) return res.status(400).json({ error: 'Username required' })

    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single()

    if (user) {
      const token = Math.random().toString(36).slice(2, 8).toUpperCase()
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()
      await supabase.from('password_reset_tokens').insert([{ user_id: user.id, token, expires_at: expiresAt }])
      console.log(`[PASSWORD RESET] Code for "${username}": ${token} (expires in 15min)`)
    }

    res.json({ success: true, message: 'If the username exists, a reset code has been sent.' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body
    if (!token || !newPassword) return res.status(400).json({ error: 'Token and new password required' })
    if (newPassword.length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters' })

    const { data: resetToken } = await supabase
      .from('password_reset_tokens')
      .select('*')
      .eq('token', token)
      .eq('used', false)
      .single()

    if (!resetToken) return res.status(400).json({ error: 'Invalid or already used reset token' })
    if (new Date(resetToken.expires_at) < new Date()) return res.status(400).json({ error: 'Reset token has expired' })

    const hash = await bcrypt.hash(newPassword, 10)
    const { data: currentUser } = await supabase
      .from('users')
      .select('token_version')
      .eq('id', resetToken.user_id)
      .single()
    const newVersion = (currentUser?.token_version || 0) + 1

    await supabase.from('users').update({ password_hash: hash, token_version: newVersion }).eq('id', resetToken.user_id)
    await supabase.from('password_reset_tokens').update({ used: true }).eq('id', resetToken.id)

    res.json({ success: true, message: 'Password reset successfully. You can now login.' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/me', authMiddleware, async (req, res) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', req.userId)
    .single()

  if (error) return res.status(500).json({ error: error.message })
  if (!user) return res.status(401).json({ error: 'User not found' })
  res.json({ user: { id: user.id, username: user.username, email: user.email || null, full_name: user.full_name || null, avatar_url: user.avatar_url || null } })
})

// Update own profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { full_name, email, avatar_url } = req.body
    const updates = {}
    if (full_name !== undefined) updates.full_name = full_name
    if (email !== undefined) updates.email = email
    if (avatar_url !== undefined) updates.avatar_url = avatar_url

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'Nothing to update' })
    }

    if (avatar_url) {
      const { data: current } = await supabase
        .from('users')
        .select('avatar_url')
        .eq('id', req.userId)
        .single()
      if (current?.avatar_url && current.avatar_url !== avatar_url) {
        await deleteCloudinaryImage(current.avatar_url)
      }
    }

    const { data: user, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', req.userId)
      .select('*')
      .single()

    if (error) return res.status(500).json({ error: error.message })
    res.json({ user: { id: user.id, username: user.username, email: user.email || null, full_name: user.full_name || null, avatar_url: user.avatar_url || null } })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// --- Admin user management ---

function requireAdmin(req, res, next) {
  if (req.userId !== 1) {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

router.get('/users', authMiddleware, requireAdmin, async (req, res) => {
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .order('id', { ascending: true })

  if (error) return res.status(500).json({ error: error.message })
  const clean = users.map((u) => ({ id: u.id, username: u.username, email: u.email || null, full_name: u.full_name || null, created_at: u.created_at }))
  res.json({ users: clean })
})

router.get('/users/:id', authMiddleware, requireAdmin, async (req, res) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', req.params.id)
    .single()

  if (error || !user) return res.status(404).json({ error: 'User not found' })
  res.json({ user: { id: user.id, username: user.username, email: user.email || null, full_name: user.full_name || null, created_at: user.created_at } })
})

router.post('/users', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { username, password, full_name, email } = req.body
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' })
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    const hash = await bcrypt.hash(password, 10)
    const { data: user, error } = await supabase
      .from('users')
      .insert([{ username, password_hash: hash, full_name, email }])
      .select('*')
      .single()

    if (error) {
      if (error.message?.includes('duplicate')) {
        return res.status(400).json({ error: 'Username already exists' })
      }
      return res.status(500).json({ error: error.message })
    }
    res.status(201).json({ user: { id: user.id, username: user.username, email: user.email || null, full_name: user.full_name || null } })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.put('/users/:id', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { username, full_name, email, password } = req.body
    const updates = {}
    if (username !== undefined) updates.username = username
    if (full_name !== undefined) updates.full_name = full_name
    if (email !== undefined) updates.email = email
    if (password) {
      if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })
      updates.password_hash = await bcrypt.hash(password, 10)
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'Nothing to update' })
    }

    const { data: user, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', req.params.id)
      .select('*')
      .single()

    if (error) {
      if (error.message?.includes('duplicate')) {
        return res.status(400).json({ error: 'Username already exists' })
      }
      return res.status(500).json({ error: error.message })
    }
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ user: { id: user.id, username: user.username, email: user.email || null, full_name: user.full_name || null } })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/users/:id', authMiddleware, requireAdmin, async (req, res) => {
  try {
    if (parseInt(req.params.id) === req.userId) {
      return res.status(400).json({ error: 'Cannot delete your own account' })
    }
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', req.params.id)

    if (error) return res.status(500).json({ error: error.message })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
