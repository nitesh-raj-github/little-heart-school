'use client'

/* ================================
   Types
================================ */

export interface CloudinaryUploadOptions {
  folder?: string
  tags?: string | string[]
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

/* ================================
   Upload (client-side, unsigned)
================================ */

const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`

export const uploadToCloudinary = async (
  file: File,
  options: CloudinaryUploadOptions = {}
): Promise<CloudinaryResponse> => {
  try {
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed')
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File must be less than 5MB')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append(
      'upload_preset',
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    )

    if (options.folder) {
      formData.append('folder', options.folder)
    }

    if (options.tags) {
      formData.append(
        'tags',
        Array.isArray(options.tags)
          ? options.tags.join(',')
          : options.tags
      )
    }

    const res = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data?.error?.message || 'Upload failed')
    }

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
    return {
      success: false,
      error: error.message
    }
  }
}

/* ================================
   Image validation
================================ */

export const validateImage = (file: File) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowed.includes(file.type)) {
    return { valid: false, message: 'Invalid image type' }
  }
  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, message: 'Max file size is 5MB' }
  }
  return { valid: true }
}

/* ================================
   Transform presets (optional)
================================ */

export const TRANSFORMATIONS = {
  HERO: 'c_fill,g_auto,w_1200,h_800,q_auto,f_auto',
  GALLERY: 'c_fill,g_auto,w_800,h_600,q_auto,f_auto',
  FACULTY: 'c_fill,g_face,w_400,h_400,q_auto,f_auto'
} as const
