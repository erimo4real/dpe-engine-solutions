import { Router } from 'express'
import cloudinary from '../config/cloudinary.js'
import { authMiddleware } from '../middleware/auth.js'
import multer from 'multer'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function validateMagicBytes(buffer) {
  if (buffer.length < 4) return false
  const header = new Uint8Array(buffer.slice(0, 12))
  const isJPEG = header[0] === 0xFF && header[1] === 0xD8 && header[2] === 0xFF
  const isPNG = header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4E && header[3] === 0x47
  const isRIFF = header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x46
  if (isRIFF && buffer.length >= 12) {
    const webpHeader = String.fromCharCode(...header.slice(8, 12))
    return webpHeader === 'WEBP'
  }
  return isJPEG || isPNG
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'))
    }
  },
})

const router = Router()

router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    if (!validateMagicBytes(req.file.buffer)) {
      return res.status(400).json({ error: 'Invalid file signature' })
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64')
    const dataURI = `data:${req.file.mimetype};base64,${b64}`

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'dpe-engine-solutions',
      transformation: [{ width: 1200, height: 1200, crop: 'limit' }],
    })

    res.json({ url: result.secure_url })
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' })
  }
})

export default router
