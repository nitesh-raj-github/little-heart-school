'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import ProtectedRoute from '@/components/ProtectedRoute'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import toast from 'react-hot-toast'

export default function AdminAboutPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)

  // LOAD EXISTING DATA
  useEffect(() => {
    const load = async () => {
      const snap = await getDoc(doc(db, 'about', 'school'))
      if (snap.exists()) {
        const d = snap.data()
        setTitle(d.title || '')
        setDescription(d.description || '')
        setImageUrl(d.imageUrl || '')
      }
    }
    load()
  }, [])

  // IMAGE UPLOAD
  const uploadImage = async (file: File) => {
    try {
      setLoading(true)
      const res = await uploadToCloudinary(file, { folder: 'about' })
      if (!res?.url) throw new Error()
      setImageUrl(res.url)
      toast.success('Image uploaded')
    } catch {
      toast.error('Image upload failed')
    } finally {
      setLoading(false)
    }
  }

  // SAVE DATA
  const save = async () => {
    try {
      setLoading(true)
      await setDoc(doc(db, 'about', 'school'), {
        title,
        description,
        imageUrl,
        updatedAt: serverTimestamp(),
      })
      toast.success('School history saved')
    } catch {
      toast.error('Save failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6">School History</h1>

        <input
          className="w-full border p-3 mb-4"
          placeholder="Title (e.g. Our Story)"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border p-3 mb-4 h-40"
          placeholder="School history description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          disabled={loading}
          onChange={e => e.target.files && uploadImage(e.target.files[0])}
        />

        {imageUrl && (
          <div className="relative h-64 mt-4">
            <Image
              src={imageUrl}
              alt="School History"
              fill
              className="object-cover rounded"
            />
          </div>
        )}

        <button
          onClick={save}
          disabled={loading}
          className="mt-6 bg-primary-red text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </ProtectedRoute>
  )
}
