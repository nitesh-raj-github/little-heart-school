'use client'

import { useState } from 'react'
import CloudinaryUploader from '@/components/CloudinaryUploader'
import { deleteFromCloudinary } from '@/lib/cloudinary'
import { FaTrash, FaCheckCircle } from 'react-icons/fa'
import toast from 'react-hot-toast'

interface ImageManagerProps {
  images: Array<{
    id: string
    publicId: string
    url: string
    title: string
    category: string
    isActive: boolean
  }>
  onImagesUpdate: () => void
}

export default function ImageManager({
  images,
  onImagesUpdate
}: ImageManagerProps) {
  const [selectedImages, setSelectedImages] = useState<string[]>([])

  const handleUploadComplete = (url: string, publicId: string) => {
    console.log('Uploaded:', { url, publicId })
    onImagesUpdate()
  }

  const handleDelete = async (publicId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    const result = await deleteFromCloudinary(publicId)

    if (result.success) {
      toast.success('Image deleted')
      onImagesUpdate()
    } else {
      toast.error(result.error || 'Delete failed')
    }
  }

  const toggleActive = (id: string) => {
    console.log('Toggle active:', id)
    onImagesUpdate()
  }

  return (
    <div className="space-y-6">
      {/* Upload */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-bold mb-4">Upload New Images</h3>
        <CloudinaryUploader
          onUploadComplete={handleUploadComplete}
          folder="gallery"
          maxFiles={5}
          preview
        />
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-bold mb-6">
          Manage Images ({images.length})
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(image => (
            <div key={image.id} className="border rounded-lg overflow-hidden">
              <div className="relative aspect-square">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />

                {image.isActive && (
                  <div className="absolute top-2 right-2">
                    <FaCheckCircle className="text-green-500" />
                  </div>
                )}
              </div>

              <div className="p-3">
                <h4 className="font-medium text-sm truncate">
                  {image.title}
                </h4>
                <p className="text-xs text-gray-500">
                  {image.category}
                </p>

                <div className="flex justify-between items-center mt-3">
                  <button
                    onClick={() => toggleActive(image.id)}
                    className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                  >
                    {image.isActive ? 'Active' : 'Inactive'}
                  </button>

                  <button
                    onClick={() => handleDelete(image.publicId)}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
