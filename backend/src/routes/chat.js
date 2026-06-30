import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { getAiReply } from '../services/aiReply.js'

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'Too many messages, slow down' },
})

const router = Router()

router.post('/', chatLimiter, async (req, res) => {
  try {
    const { message } = req.body
    const result = await getAiReply(message)
    if (result.error && !result.reply) {
      return res.status(400).json({ error: result.error })
    }
    res.json({ reply: result.reply })
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
