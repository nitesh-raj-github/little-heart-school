'use client'

import CloudinaryUploader from '@/components/CloudinaryUploader'
import { settingsAPI } from '@/lib/firestore'
import toast from 'react-hot-toast'

export default function AboutImageUploader() {
  const handleUpload = async (url: string, publicId: string) => {
    try {
      await settingsAPI.set('about', {
        imageUrl: url,
        imagePublicId: publicId
      })
      toast.success('About image updated successfully')
    } catch (error) {
      toast.error('Failed to save image')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-bold mb-4">About Page Image</h3>

      <CloudinaryUploader
        folder="about"
        maxFiles={1}
        onUploadComplete={handleUpload}
      />
    </div>
  )
}
