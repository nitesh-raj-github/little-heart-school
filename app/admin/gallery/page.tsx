// app/admin/gallery/page.tsx
'use client'

import { useEffect, useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa'
import toast from 'react-hot-toast'

import { uploadToCloudinary } from '@/lib/cloudinary'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

/* ================= TYPES ================= */

interface GalleryImage {
  id: string
  url: string
  publicId: string
  title: string
  category: string
  description: string
  date: string
  order: number
  isActive: boolean
}


/* ================= PAGE ================= */

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    category: 'Campus',
    description: '',
    date: new Date().toISOString().split('T')[0],
    isActive: true
  })

  const categories = [
    'Campus',
    'Classroom',
    'Sports',
    'Events',
    'Cultural',
    'Achievements',
    'Infrastructure'
  ]

  /* ================= FETCH ================= */

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      setLoading(true)
      const q = query(collection(db, 'gallery'), orderBy('order', 'asc'))
      const snap = await getDocs(q)

      const data: GalleryImage[] = snap.docs.map(d => {
        const v = d.data()
        return {
  id: d.id,
  url: v.imageUrl,
  publicId: v.imagePublicId,
  title: v.title,
  category: v.category,
  description: v.description || '',
  date: v.date || '',
  order: v.order,
  isActive: v.isActive
}

      })

      setImages(data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load gallery')
    } finally {
      setLoading(false)
    }
  }

  /* ================= UPLOAD (BULK) ================= */

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    try {
      for (const file of Array.from(files)) {
        const res = await uploadToCloudinary(file, {
          folder: 'gallery'
        })

        if (!res.success || !res.url || !res.publicId) {
          throw new Error('Upload failed')
        }

        await addDoc(collection(db, 'gallery'), {
  url: res.url,
  publicId: res.publicId,
  title: file.name.replace(/\.[^/.]+$/, ''),
  category: 'Campus',
  description: '',
  date: new Date().toISOString().split('T')[0],
  order: Date.now(),
  isActive: true,
  createdAt: serverTimestamp()
})
      }

      toast.success('Image(s) uploaded')
      fetchImages()
    } catch (err) {
      console.error(err)
      toast.error('Upload failed')
    } finally {
      e.target.value = ''
    }
  }

  /* ================= EDIT ================= */

  const startEdit = (img: GalleryImage) => {
    setEditingId(img.id)
    setForm({
      title: img.title,
      category: img.category,
      description: img.description,
      date: img.date,
      isActive: img.isActive
    })
  }

  const saveImage = async () => {
    if (!editingId) return

    try {
      await updateDoc(doc(db, 'gallery', editingId), {
        ...form,
        updatedAt: serverTimestamp()
      })

      toast.success('Image updated')
      setEditingId(null)
      fetchImages()
    } catch {
      toast.error('Update failed')
    }
  }

  /* ================= DELETE ================= */

  const deleteImage = async (img: GalleryImage) => {
    if (!confirm('Delete permanently?')) return

    try {
      await fetch('/api/cloudinary/delete', {
        method: 'DELETE',
        body: JSON.stringify({ publicId: img.publicId })
      })

      await deleteDoc(doc(db, 'gallery', img.id))
      toast.success('Image deleted')
      fetchImages()
    } catch {
      toast.error('Delete failed')
    }
  }

  /* ================= TOGGLE ================= */

  const toggleActive = async (img: GalleryImage) => {
    await updateDoc(doc(db, 'gallery', img.id), {
      isActive: !img.isActive
    })
    fetchImages()
  }

  /* ================= RENDER ================= */

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Gallery Management</h1>

          {/* Upload */}
          <div className="bg-white p-6 rounded-xl shadow mb-8">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleUpload}
            />
          </div>

          {/* Edit */}
          {editingId && (
            <div className="bg-white p-6 rounded-xl shadow mb-8">
              <h2 className="text-xl font-bold mb-4">Edit Image</h2>

              <input
                className="w-full border p-2 mb-3"
                placeholder="Title"
                value={form.title}
                onChange={e =>
                  setForm({ ...form, title: e.target.value })
                }
              />

              <select
                className="w-full border p-2 mb-3"
                value={form.category}
                onChange={e =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                {categories.map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <textarea
                className="w-full border p-2 mb-3"
                placeholder="Description"
                value={form.description}
                onChange={e =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <button
                onClick={saveImage}
                className="bg-primary-red text-white px-6 py-2 rounded"
              >
                Save Changes
              </button>
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {images.map(img => (
                <div key={img.id} className="bg-white rounded shadow">
                  <img
                    src={img.url}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold">{img.title}</h3>
                    <p className="text-sm">{img.category}</p>

                    <div className="flex justify-between mt-3">
                      <button onClick={() => startEdit(img)}>
                        <FaEdit />
                      </button>
                      <button onClick={() => toggleActive(img)}>
                        {img.isActive ? <FaEye /> : <FaEyeSlash />}
                      </button>
                      <button onClick={() => deleteImage(img)}>
                        <FaTrash className="text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
