'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import ProtectedRoute from '@/components/ProtectedRoute'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { uploadToCloudinary } from '@/lib/cloudinary'
import toast from 'react-hot-toast'

export default function AdminPrincipalPage() {
  const [form, setForm] = useState({
    name: '',
    designation: '',
    qualification: '',
    message: '',
    imageUrl: '',
  })

  useEffect(() => {
    const load = async () => {
      const snap = await getDoc(doc(db, 'about', 'principal'))
      if (snap.exists()) setForm(snap.data() as any)
    }
    load()
  }, [])

  const uploadImage = async (file: File) => {
    const res = await uploadToCloudinary(file, { folder: 'principal' })
    setForm(prev => ({ ...prev, imageUrl: res.url }))
  }

  const save = async () => {
    await setDoc(doc(db, 'about', 'principal'), {
      ...form,
      updatedAt: serverTimestamp(),
    })
    toast.success('Principal updated')
  }

  return (
    <ProtectedRoute>
      <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6">Principal</h1>

        {['name', 'designation', 'qualification'].map(k => (
          <input
            key={k}
            className="w-full border p-3 mb-4"
            placeholder={k}
            value={(form as any)[k]}
            onChange={e => setForm({ ...form, [k]: e.target.value })}
          />
        ))}

        <textarea
          className="w-full border p-3 mb-4 h-40"
          placeholder="Message"
          value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
        />

        <input
          type="file"
          accept="image/*"
          onChange={e => e.target.files && uploadImage(e.target.files[0])}
        />

        {form.imageUrl && (
          <div className="relative h-64 mt-4">
            <Image src={form.imageUrl} alt="Principal" fill className="object-cover rounded" />
          </div>
        )}

        <button
          onClick={save}
          className="mt-6 bg-primary-red text-white px-6 py-2 rounded"
        >
          Save
        </button>
      </div>
    </ProtectedRoute>
  )
}
