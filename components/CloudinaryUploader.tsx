'use client'

import { useRef, useState } from 'react'
import { uploadToCloudinary, validateImage } from '@/lib/cloudinary'
import { FaUpload, FaSpinner, FaTimes } from 'react-icons/fa'
import toast from 'react-hot-toast'

interface CloudinaryUploaderProps {
  onUploadComplete: (url: string, publicId: string) => void
  folder?: string
  maxFiles?: number
  preview?: boolean
}

export default function CloudinaryUploader({
  onUploadComplete,
  folder = 'gallery',
  maxFiles = 1,
  preview = true
}: CloudinaryUploaderProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [previews, setPreviews] = useState<string[]>([])

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    if (files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} file(s) allowed`)
      return
    }

    for (const file of files) {
      const check = validateImage(file)
      if (!check.valid) {
        toast.error(check.message)
        return
      }
    }

    if (preview) {
      setPreviews(files.map(file => URL.createObjectURL(file)))
    }

    setUploading(true)

    try {
      for (const file of files) {
        const result = await uploadToCloudinary(file, { folder })

        if (result.success && result.url && result.publicId) {
          onUploadComplete(result.url, result.publicId)
          toast.success('Image uploaded successfully')
        } else {
          toast.error(result.error || 'Upload failed')
        }
      }
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
      setPreviews([])
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <div
        onClick={() => !uploading && fileRef.current?.click()}
        className="border-2 border-dashed p-8 rounded-xl text-center cursor-pointer"
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple={maxFiles > 1}
          onChange={handleChange}
          hidden
        />

        {uploading ? (
          <FaSpinner className="animate-spin text-3xl mx-auto" />
        ) : (
          <>
            <FaUpload className="mx-auto text-3xl" />
            <p className="mt-2 text-sm">Click to upload image</p>
          </>
        )}
      </div>

      {preview && previews.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {previews.map((url, i) => (
            <div key={i} className="relative">
              <img src={url} className="rounded-lg object-cover" />
              <button
                onClick={() =>
                  setPreviews(prev => prev.filter((_, idx) => idx !== i))
                }
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded"
              >
                <FaTimes size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
