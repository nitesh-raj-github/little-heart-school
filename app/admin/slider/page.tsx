'use client'

import { useEffect, useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import {
  FaUpload,
  FaTrash,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import { uploadToCloudinary } from '@/lib/cloudinary'
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

/* ================= TYPES ================= */

interface SliderItem {
  id: string
  url: string
  title: string
  subtitle: string
  order: number
  isActive: boolean
}

/* ================= PAGE ================= */

export default function AdminSliderPage() {
  const [items, setItems] = useState<SliderItem[]>([])
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  /* ================= FETCH SLIDER ================= */

  const fetchSlider = async () => {
    const q = query(collection(db, 'slider'), orderBy('order', 'asc'))
    const snapshot = await getDocs(q)

    const data: SliderItem[] = snapshot.docs.map(docSnap => {
      const d = docSnap.data()
      return {
        id: docSnap.id,
        url: d.url,
        title: d.title,
        subtitle: d.subtitle || '',
        order: d.order,
        isActive: d.isActive !== false
      }
    })

    setItems(data)
  }

  useEffect(() => {
    fetchSlider()
  }, [])

  /* ================= ADD SLIDE ================= */

  const handleAdd = async () => {
    if (!imageFile || !title.trim()) {
      toast.error('Image and title required')
      return
    }

    try {
      setLoading(true)

      // Upload image to Cloudinary
      const res = await uploadToCloudinary(imageFile)

      if (!res.success || !res.url) {
        throw new Error(res.error || 'Upload failed')
      }

      const nextOrder =
        items.length > 0
          ? Math.max(...items.map(i => i.order)) + 1
          : 1

      // Save to Firestore
      await addDoc(collection(db, 'slider'), {
        url: res.url,
        title: title.trim(),
        subtitle: subtitle.trim(),
        order: nextOrder,
        isActive: true,
        createdAt: serverTimestamp()
      })

      toast.success('Slider image added')

      setTitle('')
      setSubtitle('')
      setImageFile(null)
      fetchSlider()
    } catch (err: any) {
      toast.error(err.message || 'Failed to add slide')
    } finally {
      setLoading(false)
    }
  }

  /* ================= DELETE ================= */

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'slider', id))
    fetchSlider()
  }

  /* ================= ORDER ================= */

  const move = async (id: string, dir: 'up' | 'down') => {
    const index = items.findIndex(i => i.id === id)
    if (index === -1) return

    const swapIndex = dir === 'up' ? index - 1 : index + 1
    if (!items[swapIndex]) return

    const current = items[index]
    const swap = items[swapIndex]

    await updateDoc(doc(db, 'slider', current.id), {
      order: swap.order
    })
    await updateDoc(doc(db, 'slider', swap.id), {
      order: current.order
    })

    fetchSlider()
  }

  /* ================= UI ================= */

  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Homepage Slider</h1>

        {/* ADD FORM */}
        <div className="bg-white p-4 rounded-lg shadow mb-8 space-y-3">
          <input
            type="file"
            accept="image/*"
            onChange={e => setImageFile(e.target.files?.[0] || null)}
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="Subtitle"
            value={subtitle}
            onChange={e => setSubtitle(e.target.value)}
          />

          <button
            onClick={handleAdd}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaUpload />
            {loading ? 'Uploading...' : 'Add'}
          </button>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {items.map(item => (
            <div
              key={item.id}
              className="flex items-center gap-4 bg-white p-3 rounded shadow"
            >
              <img
                src={item.url}
                alt=""
                className="w-28 h-16 object-cover rounded"
              />

              <div className="flex-1">
                <div className="font-bold">{item.title}</div>
                <div className="text-sm text-gray-500">
                  {item.subtitle}
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => move(item.id, 'up')}>
                  <FaArrowUp />
                </button>
                <button onClick={() => move(item.id, 'down')}>
                  <FaArrowDown />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  )
}
