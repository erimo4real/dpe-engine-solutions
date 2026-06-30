import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { getAiReply } from '../services/aiReply.js'

const whatsappLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Too many messages',
  keyGenerator: (req) => req.body.From || 'unknown',
})

const router = Router()

router.post('/webhook', whatsappLimiter, async (req, res) => {
  try {
    const message = (req.body.Body || '').trim()
    if (!message) {
      return res.type('text/xml').send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>Please send a text message with your question.</Message></Response>`)
    }

    const result = await getAiReply(message)
    const reply = result.reply || 'Sorry, I couldn\'t process your request. Please call or email us directly.'
    const xml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(reply)}</Message></Response>`

    res.type('text/xml').send(xml)
  } catch {
    res.type('text/xml').send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>Sorry, something went wrong. Please call us directly.</Message></Response>`)
  }
})

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

export default router
