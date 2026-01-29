'use client'

import { useEffect, useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { db } from '@/lib/firebase'
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import toast from 'react-hot-toast'

interface Faculty {
  id: string
  name: string
  designation: string
  department: string
  qualification: string
  experience: string
  email: string
  phone: string
  imageUrl?: string
  isActive: boolean
}

/* 🔥 Cloudinary config (CHANGE THESE) */
const CLOUDINARY_CLOUD_NAME = 'dvnunrbrm'
const CLOUDINARY_PRESET = 'faculty_unsigned'

async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_PRESET)
  formData.append('folder', 'faculty')

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!res.ok) throw new Error('Cloudinary upload failed')

  const data = await res.json()
  return data.secure_url
}

export default function AdminFacultyPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const [form, setForm] = useState({
    name: '',
    designation: '',
    department: '',
    qualification: '',
    experience: '',
    email: '',
    phone: '',
  })

  const fetchFaculty = async () => {
    const snap = await getDocs(collection(db, 'faculty'))
    setFaculty(
      snap.docs.map(d => ({ id: d.id, ...(d.data() as Faculty) }))
    )
    setLoading(false)
  }

  useEffect(() => {
    fetchFaculty()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (!form.name || !form.designation) {
        toast.error('Name & Designation required')
        return
      }

      let imageUrl: string | undefined

      if (file) {
        toast.loading('Uploading image...')
        imageUrl = await uploadToCloudinary(file)
        toast.dismiss()
      }

      // ✅ NEVER send undefined to Firestore
      const payload: any = {
        ...form,
        isActive: true,
        createdAt: serverTimestamp(),
      }

      if (imageUrl) payload.imageUrl = imageUrl

      await addDoc(collection(db, 'faculty'), payload)

      toast.success('Faculty added successfully')
      setOpen(false)
      setFile(null)
      setForm({
        name: '',
        designation: '',
        department: '',
        qualification: '',
        experience: '',
        email: '',
        phone: '',
      })
      fetchFaculty()
    } catch (err) {
      console.error(err)
      toast.error('Failed to add faculty')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete faculty?')) return
    await deleteDoc(doc(db, 'faculty', id))
    toast.success('Deleted')
    fetchFaculty()
  }

  return (
    <ProtectedRoute>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">Faculty Management</h1>
          <button
            onClick={() => setOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Faculty
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th>Name</th>
                <th>Designation</th>
                <th>Department</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {faculty.map(f => (
                <tr key={f.id} className="border-t">
                  <td>{f.name}</td>
                  <td>{f.designation}</td>
                  <td>{f.department}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(f.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* MODAL */}
        {open && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add Faculty</h2>

              <form onSubmit={handleSubmit} className="space-y-3">
                {Object.keys(form).map(key => (
                  <input
                    key={key}
                    placeholder={key}
                    className="w-full border p-2"
                    value={(form as any)[key]}
                    onChange={e =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                  />
                ))}

                <input
                  type="file"
                  accept="image/*"
                  onChange={e =>
                    e.target.files && setFile(e.target.files[0])
                  }
                />

                <button
                  type="submit"
                  className="bg-blue-600 text-white w-full py-2 rounded"
                >
                  Save
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
