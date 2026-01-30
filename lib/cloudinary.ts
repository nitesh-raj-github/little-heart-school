'use client'

/* ================================
   Types
================================ */

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
   Upload (via API route)
================================ */

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

/* ================================
   Delete (via API route) ✅ REQUIRED
================================ */

export const deleteFromCloudinary = async (
  publicId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const res = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ publicId })
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data?.error || 'Delete failed')
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
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
