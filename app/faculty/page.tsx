'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface Faculty {
  id: string
  name: string
  designation: string
  department: string
  qualification: string
  experience: string
  email: string
  phone: string
  imageUrl: string
  isActive: boolean
}

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const q = query(
          collection(db, 'faculty'),
          where('isActive', '==', true),
          orderBy('createdAt', 'desc')
        )

        const snap = await getDocs(q)
        const list = snap.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Faculty),
        }))

        setFaculty(list)
      } catch (err) {
        console.error('Faculty fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFaculty()
  }, [])

  if (loading) {
    return (
      <div className="pt-20 text-center">
        <p>Loading faculty...</p>
      </div>
    )
  }

  return (
    <div className="pt-20 pb-16">
      <section className="container-custom">
        <h1 className="text-4xl font-bold text-center mb-10">
          Our Faculty
        </h1>

        {faculty.length === 0 ? (
          <p className="text-center text-gray-600">
            No faculty members available
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {faculty.map(f => (
              <div
                key={f.id}
                className="bg-white rounded-xl shadow p-4 text-center"
              >
                <div className="relative h-56 w-full mb-4 rounded overflow-hidden">
                  <Image
                    src={f.imageUrl}
                    alt={f.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <h3 className="font-bold text-lg">{f.name}</h3>
                <p className="text-primary-red font-semibold">
                  {f.designation}
                </p>
                <p className="text-sm text-gray-600">{f.department}</p>
                <p className="text-sm">{f.qualification}</p>
                <p className="text-sm text-gray-500">{f.experience}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
