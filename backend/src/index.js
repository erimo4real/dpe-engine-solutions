import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { createServer } from 'http'
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import categoryRoutes from './routes/categories.js'
import inquiryRoutes from './routes/inquiries.js'
import uploadRoutes from './routes/upload.js'

const app = express()
const server = createServer(app)
const PORT = process.env.PORT || 5000

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many login attempts, try again later' },
})

const inquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: 'Too many submissions, try again later' },
})

const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many password reset attempts, try again later' },
})

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many uploads, try again later' },
})

const isProduction = process.env.NODE_ENV === 'production' || !!process.env.RENDER
const VERCEL_URL = 'https://dpe-engine-solutions.vercel.app'

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}))

app.use(cors({
  origin: isProduction
    ? [process.env.CLIENT_URL, VERCEL_URL].filter(Boolean)
    : process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/forgot-password', passwordResetLimiter)
app.use('/api/auth/reset-password', passwordResetLimiter)
app.use('/api/inquiries', inquiryLimiter)
app.use('/api/upload', uploadLimiter)

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/inquiries', inquiryRoutes)
app.use('/api/upload', uploadRoutes)

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok' })
})

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
