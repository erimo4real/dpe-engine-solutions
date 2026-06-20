import { Router } from 'express'
import cloudinary from '../config/cloudinary.js'
import { authMiddleware } from '../middleware/auth.js'
import multer from 'multer'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (allowed.includes(file.mimetype)) {
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
