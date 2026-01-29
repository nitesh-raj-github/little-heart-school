'use client'

import { useState, useEffect } from 'react'
import ImageSlider from '../components/ImageSlider'
import {
  FaGraduationCap,
  FaUsers,
  FaAward,
  FaBookOpen
} from 'react-icons/fa'
import { motion } from 'framer-motion'
import {
  collection,
  getDocs,
  query,
  where,
  orderBy
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

/* ================= STATS ================= */

const stats = [
  { icon: <FaGraduationCap />, value: '19+', label: 'Years of Excellence' },
  { icon: <FaUsers />, value: '500+', label: 'Happy Students' },
  { icon: <FaAward />, value: '100%', label: 'Board Results' },
  { icon: <FaBookOpen />, value: 'CBSE', label: 'Affiliated' }
]

/* ================= PAGE ================= */

export default function Home() {
  const [slides, setSlides] = useState<
    { src: string; alt: string; caption?: string }[]
  >([])
  const [loading, setLoading] = useState(true)
  const [currentStat, setCurrentStat] = useState(0)

  /* ===== Fetch slider images from Firestore ===== */
useEffect(() => {
  const fetchSlides = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'slider'))

      console.log('RAW SNAPSHOT SIZE:', snapshot.size)

      const data = snapshot.docs.map(doc => {
        const d = doc.data()
        console.log('DOC:', d)
        return {
          src: d.url,
          alt: d.title || 'Slider',
          caption: d.subtitle || ''
        }
      })

      setSlides(data)
    } catch (e) {
      console.error('Firestore READ FAILED:', e)
    } finally {
      setLoading(false)
    }
  }

  fetchSlides()
}, [])

  /* ===== Animated stats ===== */

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat(prev => (prev + 1) % stats.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  /* ================= RENDER ================= */

  return (
    <div className="overflow-hidden">
      {/* ================= HERO SECTION ================= */}
      <section className="relative h-[90vh]">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="h-10 w-10 border-b-2 border-white animate-spin rounded-full" />
          </div>
        ) : (
          <ImageSlider images={slides} autoPlay interval={5000} />
        )}

        {/* Overlay Content */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40">
          <div className="container-custom h-full flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white max-w-2xl"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Little Heart Public School
              </h1>
              <p className="text-xl md:text-2xl mb-6 text-gray-200">
                Where Every Child Matters
              </p>
              <p className="text-lg mb-8">
                Nurturing young minds with compassion, innovation, and
                traditional values since 2005
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="btn-primary">
                  Admissions Open 2024-25
                </button>
                <button className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-full font-semibold hover:bg-white/30 transition border border-white/30">
                  Virtual Tour
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Location Badge */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
            <div className="flex items-center gap-2">
              <FaGraduationCap className="text-primary-red" />
              <span className="font-semibold text-gray-800">
                Near Power House Chowk, Bara Chakia, East Champaran
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="py-16 bg-primary-navy text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: currentStat === index ? 1 : 0.7,
                  scale: currentStat === index ? 1.05 : 1
                }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= QUICK LINKS ================= */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Explore Our School
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Academics',
                desc: 'CBSE Curriculum LKG to 10',
                link: '/academics',
                color: 'bg-primary-teal'
              },
              {
                title: 'Facilities',
                desc: 'Smart Classes & Labs',
                link: '/facilities',
                color: 'bg-primary-red'
              },
              {
                title: 'Admissions',
                desc: '2024-25 Open Now',
                link: '/admissions',
                color: 'bg-primary-navy'
              },
              {
                title: 'Faculty',
                desc: 'Qualified & Experienced',
                link: '/faculty',
                color: 'bg-primary-yellow'
              },
              {
                title: 'Gallery',
                desc: 'Campus Life Photos',
                link: '/gallery',
                color: 'bg-green-500'
              },
              {
                title: 'Contact',
                desc: 'Visit or Call Us',
                link: '/contact',
                color: 'bg-purple-500'
              }
            ].map((item, index) => (
              <a
                key={index}
                href={item.link}
                className={`${item.color} text-white rounded-2xl p-8 card-hover text-center`}
              >
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p>{item.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
