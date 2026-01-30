'use client'

export interface CloudinaryUploadOptions {
  folder?: string
  publicId?: string
  tags?: string[]
  transformations?: string
}

export interface CloudinaryResponse {
  success: boolean
  url?: string
  publicId?: string
  width?: number
  height?: number
  format?: string
  bytes?: number
  error?: string
}

export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
  apiUrl: `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`
} as const

export const TRANSFORMATIONS = {
  HERO: 'c_fill,g_auto,w_1200,h_800,q_auto,f_auto',
  GALLERY: 'c_fill,g_auto,w_800,h_600,q_auto,f_auto',
  THUMBNAIL: 'c_fill,g_auto,w_300,h_200,q_auto,f_auto',
  FACULTY: 'c_fill,g_face,w_400,h_400,q_auto,f_auto',
  WEBP: 'f_webp,q_auto',
  BLUR: 'e_blur:1000,q_1'
} as const

export const uploadToCloudinary = async (
  file: File,
  options: CloudinaryUploadOptions = {}
): Promise<CloudinaryResponse> => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset)

    if (options.folder) formData.append('folder', options.folder)
    if (options.publicId) formData.append('public_id', options.publicId)
    if (options.tags?.length) formData.append('tags', options.tags.join(','))
    if (options.transformations)
      formData.append('transformation', options.transformations)

    const res = await fetch(CLOUDINARY_CONFIG.apiUrl, {
      method: 'POST',
      body: formData
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data?.error?.message || 'Upload failed')

    return {
      success: true,
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format,
      bytes: data.bytes
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const optimizeImage = async (
  file: File,
  maxWidth = 1920,
  quality = 80
): Promise<File> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    const img = new Image()

    reader.onload = e => {
      img.src = e.target?.result as string
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width)
        const canvas = document.createElement('canvas')
        canvas.width = img.width * scale
        canvas.height = img.height * scale
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject('Canvas error')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(
          blob =>
            blob
              ? resolve(
                  new File([blob], file.name, {
                    type: 'image/jpeg',
                    lastModified: Date.now()
                  })
                )
              : reject('Blob error'),
          'image/jpeg',
          quality / 100
        )
      }
    }

    reader.readAsDataURL(file)
  })

export const validateImage = (file: File) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowed.includes(file.type)) return { valid: false, message: 'Invalid type' }
  if (file.size > 5 * 1024 * 1024) return { valid: false, message: 'Max 5MB' }
  return { valid: true }
}
