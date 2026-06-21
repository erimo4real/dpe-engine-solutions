import jwt from 'jsonwebtoken'
import { supabase } from '../config/supabase.js'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'

if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'dev-secret-change-in-production')) {
  console.error('WARNING: JWT_SECRET is not set or is using default value. Set a strong random secret in production.')
}

const isProduction = process.env.NODE_ENV === 'production' || !!process.env.RENDER

export const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  path: '/',
}

export function generateToken(userId, tokenVersion = 0, role = 'admin') {
  return jwt.sign({ userId, tokenVersion, role }, JWT_SECRET, { expiresIn: '7d' })
}

export async function authMiddleware(req, res, next) {
  const token = req.cookies?.token
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' })
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    const { data: user } = await supabase
      .from('users')
      .select('token_version, role')
      .eq('id', decoded.userId)
      .single()
    if (!user || user.token_version !== decoded.tokenVersion) {
      res.clearCookie('token', cookieOptions)
      return res.status(401).json({ error: 'Session expired, please login again' })
    }
    req.userId = decoded.userId
    req.userRole = user.role || 'admin'
    next()
  } catch {
    res.clearCookie('token', cookieOptions)
    return res.status(401).json({ error: 'Invalid token' })
  }
}

export function requireAdmin(req, res, next) {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

export function csrfProtection(req, res, next) {
  const unsafeMethods = ['POST', 'PUT', 'PATCH', 'DELETE']
  if (unsafeMethods.includes(req.method)) {
    const requestedWith = req.headers['x-requested-with']
    if (requestedWith !== 'XMLHttpRequest') {
      return res.status(403).json({ error: 'CSRF validation failed' })
    }
  }
  next()
}
