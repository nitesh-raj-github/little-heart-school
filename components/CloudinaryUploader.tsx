// components/CloudinaryUploader.tsx
'use client'

import { useState, useRef } from 'react'
import { 
  uploadToCloudinary, 
  validateImage, 
  TRANSFORMATIONS 
} from '@/lib/cloudinary'
import { FaUpload, FaImage, FaTimes, FaSpinner } from 'react-icons/fa'
import toast from 'react-hot-toast'

interface CloudinaryUploaderProps {
  onUploadComplete: (url: string, publicId: string) => void
  folder?: 'slider' | 'gallery' | 'faculty' | 'events' | 'about'
  tags?: string[]
  maxFiles?: number
  preview?: boolean
  transformation?: keyof typeof TRANSFORMATIONS
}

export default function CloudinaryUploader({
  onUploadComplete,
  folder = 'gallery',
  tags = [],
  maxFiles = 1,
  preview = true,
  transformation = 'GALLERY'
}: CloudinaryUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    if (files.length === 0) return
    
    // Validate number of files
    if (files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} file${maxFiles > 1 ? 's' : ''} allowed`)
      return
    }
    
    // Validate each file
    for (const file of files) {
      const validation = validateImage(file)
      if (!validation.valid) {
        toast.error(validation.message)
        return
      }
    }
    
    // Create preview URLs
    if (preview) {
      const urls = files.map(file => URL.createObjectURL(file))
      setPreviewUrls(urls)
    }
    
    // Upload files
    setUploading(true)
    
    try {
      for (const file of files) {
       const result = await uploadToCloudinary(file, {
  folder,
  tags
})

        
        if (result.success && result.url && result.publicId) {
          onUploadComplete(result.url, result.publicId)
          toast.success('Image uploaded successfully!')
        } else {
          toast.error(result.error || 'Upload failed')
        }
      }
    } catch (error) {
      toast.error('Upload failed. Please try again.')
    } finally {
      setUploading(false)
      
      // Clear previews
      if (preview) {
        previewUrls.forEach(url => URL.revokeObjectURL(url))
        setPreviewUrls([])
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removePreview = (index: number) => {
    URL.revokeObjectURL(previewUrls[index])
    const newUrls = previewUrls.filter((_, i) => i !== index)
    setPreviewUrls(newUrls)
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-colors hover:border-primary-red
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={maxFiles > 1}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        
        <div className="space-y-4">
          {uploading ? (
            <div className="flex flex-col items-center">
              <FaSpinner className="animate-spin text-3xl text-primary-red mb-2" />
              <p className="text-gray-600">Uploading...</p>
            </div>
          ) : (
            <>
              <FaUpload className="mx-auto text-3xl text-gray-400" />
              <div>
                <p className="font-medium text-gray-700">
                  Click or drag to upload images
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  JPEG, PNG, GIF, WebP up to 5MB
                </p>
                {maxFiles > 1 && (
                  <p className="text-sm text-gray-500">
                    Maximum {maxFiles} files
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Preview Area */}
      {preview && previewUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => removePreview(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full
                         opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FaTimes size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}