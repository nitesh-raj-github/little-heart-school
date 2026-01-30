'use client'

/**
 * Cloudinary client-side helpers
 * Used only for uploads via unsigned presets
 */

export interface CloudinaryUploadOptions {
  folder?: string
  publicId?: string
  tags?: string[]
  transformations?: string
}

export interface CloudinaryUploadResult {
  success: boolean
  url?: string
  publicId?: string
  width?: number
  height?: number
  format?: string
  bytes?: number
  error?: string
}

/**
 * Upload file to Cloudinary
 */
export const uploadToCloudinary = async (
  file: File,
  options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult> => {
  try {
    const formData = new FormData()

    formData.append('file', file)
    formData.append(
      'upload_preset',
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    )

    if (options.folder) {
      formData.append('folder', options.folder)
    }

    if (options.publicId) {
      formData.append('public_id', options.publicId)
    }

    if (options.tags && options.tags.length > 0) {
      formData.append('tags', options.tags.join(','))
    }

    if (options.transformations) {
      formData.append('transformation', options.transformations)
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: 'POST',
        body: formData
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText)
    }

    const data = await response.json()

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
    console.error('Cloudinary upload error:', error)
    return {
      success: false,
      error: error.message || 'Cloudinary upload failed'
    }
  }
}

/**
 * Client-side image optimization
 */
export const optimizeImage = async (
  file: File,
  maxWidth: number,
  quality: number
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()

    reader.onload = () => {
      img.src = reader.result as string
    }

    reader.onerror = reject

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const scale = Math.min(1, maxWidth / img.width)

      canvas.width = img.width * scale
      canvas.height = img.height * scale

      const ctx = canvas.getContext('2d')
      if (!ctx) return reject('Canvas error')

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(
        blob => {
          if (!blob) return reject('Blob creation failed')
          resolve(
            new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
          )
        },
        file.type,
        quality / 100
      )
    }

    reader.readAsDataURL(file)
  })
}
