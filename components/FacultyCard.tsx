// components/FacultyCard.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FaEnvelope, FaPhone, FaGraduationCap, FaBook, FaUserGraduate, FaAward } from 'react-icons/fa'
import { motion } from 'framer-motion'

interface FacultyCardProps {
  faculty: {
    id: number
    name: string
    designation: string
    department: string
    qualification: string
    experience: string
    email: string
    phone: string
    image: string
    subjects: string[]
    achievements?: string[]
  }
  index: number
}

export default function FacultyCard({ faculty, index }: FacultyCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover"
    >
      {/* Faculty Image */}
      <div className="relative h-64 bg-gradient-to-br from-primary-navy/10 to-primary-teal/10">
        <Image
          src={faculty.image}
          alt={faculty.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <h3 className="text-xl font-bold text-white">{faculty.name}</h3>
          <p className="text-white/90">{faculty.designation}</p>
        </div>
        <div className="absolute top-4 right-4">
          <span className="bg-primary-red text-white px-3 py-1 rounded-full text-sm font-medium">
            {faculty.department}
          </span>
        </div>
      </div>

      {/* Faculty Info */}
      <div className="p-6">
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <FaGraduationCap className="text-primary-teal" />
            <span className="text-gray-700">{faculty.qualification}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaUserGraduate className="text-primary-red" />
            <span className="text-gray-700">{faculty.experience} Experience</span>
          </div>
          <div className="flex items-center gap-2">
            <FaBook className="text-primary-navy" />
            <span className="text-gray-700">{faculty.subjects.join(', ')}</span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-200 pt-4 space-y-2">
          <div className="flex items-center gap-2">
            <FaEnvelope className="text-gray-500" />
            <a 
              href={`mailto:${faculty.email}`}
              className="text-gray-600 hover:text-primary-red text-sm"
            >
              {faculty.email}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <FaPhone className="text-gray-500" />
            <a 
              href={`tel:${faculty.phone}`}
              className="text-gray-600 hover:text-primary-red text-sm"
            >
              {faculty.phone}
            </a>
          </div>
        </div>

        {/* Toggle Details Button */}
        {faculty.achievements && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full mt-4 text-primary-red hover:text-red-600 font-medium text-sm flex items-center justify-center gap-1"
          >
            {showDetails ? 'Hide' : 'Show'} Achievements
            <motion.span
              animate={{ rotate: showDetails ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              ↓
            </motion.span>
          </button>
        )}

        {/* Achievements Details */}
        {showDetails && faculty.achievements && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <FaAward className="text-yellow-500" />
              Achievements
            </h4>
            <ul className="space-y-1">
              {faculty.achievements.map((achievement, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-primary-red mt-1">•</span>
                  {achievement}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}