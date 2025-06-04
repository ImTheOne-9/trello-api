import cloudinary from 'cloudinary'
import streamifier from 'streamifier'
import { env } from '~/config/environment'

// Config Cloudinary
const cloudinaryV2 = cloudinary.v2

// Configuration
cloudinaryV2.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
})

const streamUpload = (fileBuffer, folderName) => {
  return new Promise((resolve, reject) => {
    // Tao 1 luong stream upload len cloudinary
    let stream = cloudinaryV2.uploader.upload_stream({ folder: folderName }, (error, result) => {
      if (result) {
        resolve(result)
      } else {
        reject(error)
      }
    }
    )

    streamifier.createReadStream(fileBuffer).pipe(stream)
  })
}

export const CloudinaryProvider = {
  streamUpload
}