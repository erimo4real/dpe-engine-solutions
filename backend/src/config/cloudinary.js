import { v2 as cloudinary } from 'cloudinary'
import { config } from 'dotenv'

config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export function deleteCloudinaryImage(url) {
  if (!url || !url.includes('res.cloudinary.com')) return Promise.resolve()
  const match = url.match(/\/image\/upload\/v\d+\/(.+)\.\w+$/)
  if (!match) return Promise.resolve()
  return cloudinary.uploader.destroy(match[1]).catch(() => {})
}

export default cloudinary
