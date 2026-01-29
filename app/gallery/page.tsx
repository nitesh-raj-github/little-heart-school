'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaSearch
} from 'react-icons/fa'
import {
  collection,
  getDocs,
  query,
  where,
  orderBy
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface GalleryImage {
  id: string
  src: string
  title: string
  category: string
  date?: string
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const q = query(
          collection(db, 'gallery'),
          where('isActive', '==', true),
          orderBy('order', 'asc')
        )

        const snap = await getDocs(q)

        const data: GalleryImage[] = snap.docs.map(doc => {
          const d = doc.data()
          return {
            id: doc.id,
            src: d.imageUrl,   // ✅ FIXED
            title: d.title,
            category: d.category,
            date: d.date
          }
        })

        setImages(data)
      } catch (err) {
        console.error('Gallery fetch failed:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchGallery()
  }, [])

  const categories = [
    'All',
    ...Array.from(new Set(images.map(img => img.category)))
  ]

  const filteredImages = images.filter(img => {
    const matchCategory =
      selectedCategory === 'All' || img.category === selectedCategory

    const matchSearch =
      img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.category.toLowerCase().includes(searchTerm.toLowerCase())

    return matchCategory && matchSearch
  })

  const selectedImageData = images.find(img => img.id === selectedImage)

  const nextImage = () => {
    if (!selectedImage) return
    const index = filteredImages.findIndex(i => i.id === selectedImage)
    setSelectedImage(filteredImages[(index + 1) % filteredImages.length].id)
  }

  const prevImage = () => {
    if (!selectedImage) return
    const index = filteredImages.findIndex(i => i.id === selectedImage)
    setSelectedImage(
      filteredImages[(index - 1 + filteredImages.length) % filteredImages.length].id
    )
  }

  return (
    <div className="pt-20 pb-16">
      {/* Search + Filter */}
      <div className="container-custom mb-8 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-80">
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search photos..."
            className="pl-12 pr-4 py-3 w-full rounded-full border"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === cat
                  ? 'bg-primary-red text-white'
                  : 'bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="container-custom">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : filteredImages.length === 0 ? (
          <p className="text-center text-gray-500">No images found</p>
        ) : (
          <motion.div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
            {filteredImages.map(img => (
              <div
                key={img.id}
                onClick={() => setSelectedImage(img.id)}
                className="mb-4 cursor-pointer"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <Image
                    src={img.src}
                    alt={img.title}
                    fill
                    sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImageData && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-6xl w-full" onClick={e => e.stopPropagation()}>
              <button
                className="absolute -top-12 right-0 text-white"
                onClick={() => setSelectedImage(null)}
              >
                <FaTimes size={28} />
              </button>

              <button onClick={prevImage} className="absolute left-4 top-1/2 text-white">
                <FaChevronLeft size={32} />
              </button>

              <button onClick={nextImage} className="absolute right-4 top-1/2 text-white">
                <FaChevronRight size={32} />
              </button>

              <div className="relative h-[70vh]">
                <Image
                  src={selectedImageData.src}
                  alt={selectedImageData.title}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
