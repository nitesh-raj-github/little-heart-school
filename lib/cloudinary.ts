// lib/cloudinary.ts
/**
 * FREE Cloudinary Setup for School Website
 * No server required for basic uploads!
 */

// Cloudinary configuration
export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo',
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'littleheart_school',
  apiUrl: `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo'}/image/upload`
} as const

// Image transformation presets
export const TRANSFORMATIONS = {
  // Hero/Slider images
  HERO: 'c_fill,g_auto,w_1200,h_800,q_auto,f_auto',
  // Gallery images
  GALLERY: 'c_fill,g_auto,w_800,h_600,q_auto,f_auto',
  // Thumbnails
  THUMBNAIL: 'c_fill,g_auto,w_300,h_200,q_auto,f_auto',
  // Faculty profiles
  FACULTY: 'c_fill,g_face,w_400,h_400,q_auto,f_auto',
  // WebP format (better compression)
  WEBP: 'f_webp,q_auto',
  // Blur placeholder for lazy loading
  BLUR: 'e_blur:1000,q_1'
} as const

// Upload image directly from client (NO server needed!)
export const uploadToCloudinary = async (
  file: File,
  options?: {
    folder?: string
    tags?: string[]
  }
): Promise<CloudinaryResponse> => {

  try {
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed')
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset)

    // ✅ THIS IS WHAT FIXES THE UNDERLINE
    if (options?.folder) {
      formData.append('folder', options.folder)
    }
    if (options?.tags && options.tags.length > 0) {
  formData.append('tags', options.tags.join(','))
}


    const response = await fetch(CLOUDINARY_CONFIG.apiUrl, {
      method: 'POST',
      body: formData
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Cloudinary response:', data)
      throw new Error(data?.error?.message || 'Upload failed')
    }

    return {
      success: true,
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format,
      bytes: data.bytes,
      folder: options?.folder
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}


// Upload multiple images
export const uploadMultipleToCloudinary = async (
  files: File[]
): Promise<CloudinaryResponse[]> => {
  const uploads = files.map(file => uploadToCloudinary(file))
  return await Promise.all(uploads)
}


// Delete image (requires server-side API)
export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/cloudinary/delete?publicId=${publicId}`, {
      method: 'DELETE'
    })
    return response.ok
  } catch (error) {
    console.error('Delete error:', error)
    return false
  }
}

// Generate image URL with transformations
export const getImageUrl = (
  publicId: string,
  transformation?: string
): string => {
  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload`
  
  if (transformation) {
    return `${baseUrl}/${transformation}/${publicId}`
  }
  
  return `${baseUrl}/${publicId}`
}

// Generate responsive image srcset
export const getResponsiveSrcSet = (
  publicId: string,
  baseTransformation: string = 'q_auto,f_auto'
): {
  src: string
  srcSet: string
  sizes: string
} => {
  const widths = [320, 640, 768, 1024, 1280]
  
  const srcSet = widths
    .map(width => {
      const transformation = `${baseTransformation},w_${width}`
      const url = getImageUrl(publicId, transformation)
      return `${url} ${width}w`
    })
    .join(', ')

  return {
    src: getImageUrl(publicId, `${baseTransformation},w_1024`),
    srcSet,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
  }
}

// Optimize image on client side
export const optimizeImage = async (
  file: File,
  maxWidth: number = 1920,
  quality: number = 80
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    const img = new Image()
    
    reader.onload = (e) => {
      if (!e.target?.result) {
        reject(new Error('Failed to read file'))
        return
      }
      
      img.src = e.target.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          reject(new Error('Canvas context not available'))
          return
        }
        
        // Calculate new dimensions
        let width = img.width
        let height = img.height
        
        if (width > maxWidth) {
          height = (maxWidth / width) * height
          width = maxWidth
        }
        
        canvas.width = width
        canvas.height = height
        
        // Draw optimized image
        ctx.drawImage(img, 0, 0, width, height)
        
        // Convert back to File
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const optimizedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              })
              resolve(optimizedFile)
            } else {
              reject(new Error('Failed to optimize image'))
            }
          },
          'image/jpeg',
          quality / 100
        )
      }
    }
    
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

// Types
export interface CloudinaryResponse {
  success: boolean
  url?: string
  publicId?: string
  tags?: string[]
  width?: number
  height?: number
  format?: string
  bytes?: number
  folder?: string
  error?: string
}

// Image validation
export const validateImage = (file: File): { valid: boolean; message?: string } => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      message: `Only ${allowedTypes.join(', ')} files are allowed`
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      message: `File size must be less than ${maxSize / (1024 * 1024)}MB`
    }
  }

  return { valid: true }
}
