// components/Admin/ImageManager.tsx
'use client'

import { useState } from 'react'
import CloudinaryUploader from '@/components/CloudinaryUploader'
import { deleteFromCloudinary } from '@/lib/cloudinary'
import { FaTrash, FaEdit, FaEye, FaCheckCircle } from 'react-icons/fa'
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

export default function ImageManager({ images, onImagesUpdate }: ImageManagerProps) {
  const [selectedImages, setSelectedImages] = useState<string[]>([])

  const handleUploadComplete = (url: string, publicId: string) => {
    // Save to your database (Firestore) with Cloudinary publicId
    console.log('Uploaded:', { url, publicId })
    onImagesUpdate()
  }

  const handleDelete = async (publicId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      const success = await deleteFromCloudinary(publicId)
      if (success) {
        toast.success('Image deleted')
        onImagesUpdate()
      } else {
        toast.error('Delete failed')
      }
    } catch (error) {
      toast.error('Error deleting image')
    }
  }

  const toggleActive = (id: string) => {
    // Update in your database
    console.log('Toggle active:', id)
    onImagesUpdate()
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-bold mb-4">Upload New Images</h3>
        <CloudinaryUploader
          onUploadComplete={handleUploadComplete}
          folder="gallery"
          tags={['school', 'gallery']}
          maxFiles={5}
          preview={true}
        />
      </div>

      {/* Image List */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">Manage Images ({images.length})</h3>
          {selectedImages.length > 0 && (
            <button
              onClick={() => {
                selectedImages.forEach(id => handleDelete(id))
                setSelectedImages([])
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Delete Selected ({selectedImages.length})
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className={`border rounded-lg overflow-hidden ${
                selectedImages.includes(image.id) ? 'border-primary-red ring-2 ring-primary-red' : ''
              }`}
            >
              {/* Image */}
              <div className="relative aspect-square">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Selection checkbox */}
                <input
                  type="checkbox"
                  checked={selectedImages.includes(image.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedImages([...selectedImages, image.id])
                    } else {
                      setSelectedImages(selectedImages.filter(id => id !== image.id))
                    }
                  }}
                  className="absolute top-2 left-2"
                />
                
                {/* Status badge */}
                {image.isActive && (
                  <div className="absolute top-2 right-2">
                    <FaCheckCircle className="text-green-500" />
                  </div>
                )}
              </div>

              {/* Info & Actions */}
              <div className="p-3">
                <h4 className="font-medium text-sm truncate">{image.title}</h4>
                <p className="text-xs text-gray-500">{image.category}</p>
                
                <div className="flex justify-between items-center mt-3">
                  <button
                    onClick={() => toggleActive(image.id)}
                    className={`text-xs px-2 py-1 rounded ${
                      image.isActive
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {image.isActive ? 'Active' : 'Inactive'}
                  </button>
                  
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleDelete(image.publicId)}
                      className="p-1 text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}