// utils/uploadToCloudinary.ts
'use client'

import { uploadToCloudinary, optimizeImage } from '@/lib/cloudinary'

export interface UploadOptions {
  folder?: string
  publicId?: string
  tags?: string[]
  optimize?: boolean
  maxWidth?: number
  quality?: number
  transformations?: string
}

export const uploadImage = async (
  file: File,
  options: UploadOptions = {}
): Promise<{
  url: string
  publicId: string
  width: number
  height: number
  format: string
  bytes: number
}> => {
  try {
    let fileToUpload = file
    
    // Optimize image if requested
    if (options.optimize !== false && file.type.startsWith('image/')) {
      fileToUpload = await optimizeImage(
        file,
        options.maxWidth || 1920,
        options.quality || 80
      )
    }
    
    // Upload to Cloudinary
    const result = await uploadToCloudinary(fileToUpload, {
      folder: options.folder || 'littleheart_school',
      publicId: options.publicId,
      tags: options.tags,
      transformations: options.transformations
    })
    
    if (!result.success || !result.url || !result.publicId) {
      throw new Error(result.error || 'Upload failed')
    }
    
    return {
      url: result.url,
      publicId: result.publicId,
      width: result.width || 0,
      height: result.height || 0,
      format: result.format || 'jpg',
      bytes: result.bytes || 0
    }
    
  } catch (error) {
    console.error('Image upload error:', error)
    throw new Error('Failed to upload image')
  }
}

export const uploadMultipleImages = async (
  files: File[],
  options: UploadOptions = {}
): Promise<Array<{
  url: string
  publicId: string
  width: number
  height: number
  format: string
  bytes: number
}>> => {
  const uploadPromises = files.map(file => uploadImage(file, options))
  return await Promise.all(uploadPromises)
}

export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    const response = await fetch(`/api/cloudinary/delete?publicId=${encodeURIComponent(publicId)}`, {
      method: 'DELETE'
    })
    
    if (!response.ok) {
      throw new Error('Delete failed')
    }
  } catch (error) {
    console.error('Delete image error:', error)
    throw error
  }
}

// Image optimization helper
export const createImageOptimizer = (
  maxWidth: number = 1920,
  quality: number = 80
) => {
  return async (file: File): Promise<File> => {
    return await optimizeImage(file, maxWidth, quality)
  }
}

// Generate responsive image URLs
export const getResponsiveImageUrls = (
  publicId: string,
  options: {
    widths?: number[]
    transformations?: string
  } = {}
): {
  src: string
  srcSet: string
  sizes: string
} => {
  const widths = options.widths || [320, 640, 768, 1024, 1280, 1920]
  const baseTransformations = options.transformations || 'q_auto,f_webp'
  
  const urls = widths.map(width => {
    const url = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${baseTransformations},w_${width}/${publicId}`
    return `${url} ${width}w`
  })
  
  return {
    src: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${baseTransformations},w_1024/${publicId}`,
    srcSet: urls.join(', '),
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
  }
}