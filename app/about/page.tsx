'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import {
  FaBullseye,
  FaEye,
  FaHeart,
  FaUsers,
  FaGraduationCap
} from 'react-icons/fa'

const values = [
  { icon: <FaBullseye />, title: 'Excellence', desc: 'Striving for highest standards in academics and character' },
  { icon: <FaHeart />, title: 'Compassion', desc: 'Teaching empathy and kindness towards all' },
  { icon: <FaUsers />, title: 'Community', desc: 'Building strong relationships with parents and society' },
  { icon: <FaGraduationCap />, title: 'Innovation', desc: 'Embracing modern teaching methodologies' },
]

export default function AboutPage() {
  const [school, setSchool] = useState<any>(null)
  const [principal, setPrincipal] = useState<any>(null)

  useEffect(() => {
  const fetchData = async () => {
    const schoolSnap = await getDoc(doc(db, 'about', 'school'))
    const principalSnap = await getDoc(doc(db, 'about', 'principal'))

    if (schoolSnap.exists()) setSchool(schoolSnap.data())
    if (principalSnap.exists()) setPrincipal(principalSnap.data())
  }

  fetchData()
}, [])


  return (
    <div className="pt-20">

      {/* HERO */}
      <section className="relative h-[40vh] bg-gradient-to-r from-primary-navy to-primary-teal">
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Our School</h1>
            <p className="text-xl">Nurturing Hearts, Shaping Futures Since 2005</p>
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      {school && (
        <section className="py-16">
          <div className="container-custom grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-3xl font-bold mb-6">{school.title}</h2>
              <p className="text-gray-600 whitespace-pre-line">{school.description}</p>
            </motion.div>

            {school.imageUrl && (
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={school.imageUrl}
                  alt="School History"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* VALUES */}
      <section className="py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-12">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow text-center">
                <div className="text-3xl text-primary-red mb-4">{v.icon}</div>
                <h4 className="font-bold mb-2">{v.title}</h4>
                <p className="text-gray-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRINCIPAL */}
      {principal && (
        <section className="py-16 bg-gradient-to-r from-primary-navy to-primary-teal">
          <div className="container-custom">
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl md:flex">
              <div className="md:w-1/3 relative h-[400px]">
                <Image
                  src={principal.imageUrl}
                  alt={principal.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="md:w-2/3 p-8">
                <h3 className="text-2xl font-bold mb-4">Message from the Principal</h3>
                <p className="text-gray-600 whitespace-pre-line mb-6">
                  {principal.message}
                </p>

                <p className="text-primary-red font-semibold">Warm regards,</p>
                <p className="font-bold">{principal.name}</p>
                <p className="text-sm text-gray-500">{principal.qualification}</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
