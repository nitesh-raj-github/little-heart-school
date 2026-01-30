'use client'

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

export const uploadToCloudinary = async (
  file: File,
  options: { folder?: string } = {}
): Promise<CloudinaryResponse> => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    if (options.folder) {
      formData.append('folder', options.folder)
    }

    const res = await fetch('/api/cloudinary/upload', {
      method: 'POST',
      body: formData
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data?.error || 'Upload failed')
    }

    return {
      success: true,
      url: data.url,
      publicId: data.publicId,
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
