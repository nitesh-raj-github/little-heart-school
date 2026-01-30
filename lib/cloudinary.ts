'use client'

/* ================================
   Types
================================ */

export interface CloudinaryUploadOptions {
  folder?: string
  tags?: string[]
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
   Config
================================ */

const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`

/* ================================
   Upload (client-side, unsigned)
================================ */

export const uploadToCloudinary = async (
  file: File,
  options: CloudinaryUploadOptions = {}
): Promise<CloudinaryResponse> => {
  try {
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files allowed')
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

    if (options.tags?.length) {
      formData.append('tags', options.tags.join(','))
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
