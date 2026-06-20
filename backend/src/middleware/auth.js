import jwt from 'jsonwebtoken'
import { supabase } from '../config/supabase.js'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'

const isProduction = process.env.NODE_ENV === 'production' || !!process.env.RENDER

export const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  path: '/',
}

export function generateToken(userId, tokenVersion = 0) {
  return jwt.sign({ userId, tokenVersion }, JWT_SECRET, { expiresIn: '7d' })
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
      .select('token_version')
      .eq('id', decoded.userId)
      .single()
    if (!user || user.token_version !== decoded.tokenVersion) {
      res.clearCookie('token', cookieOptions)
      return res.status(401).json({ error: 'Session expired, please login again' })
    }
    req.userId = decoded.userId
    next()
  } catch {
    res.clearCookie('token', cookieOptions)
    return res.status(401).json({ error: 'Invalid token' })
  }
}
