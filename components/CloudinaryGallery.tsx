'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FaSearch, FaTimes, FaDownload } from 'react-icons/fa'
import { getImageUrl, TRANSFORMATIONS } from '@/lib/cloudinary'

interface GalleryImage {
  id: string
  publicId: string
  title: string
  category: string
  description?: string
  date?: string
}

interface CloudinaryGalleryProps {
  images: GalleryImage[]
}

export default function CloudinaryGallery({ images }: CloudinaryGalleryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  /* ✅ Categories (auto-generated) */
  const categories = [
    'All',
    ...Array.from(new Set(images.map(img => img.category))),
  ]

  /* ✅ Filtered Images */
  const filteredImages = images.filter(img => {
    const matchesCategory =
      selectedCategory === 'All' || img.category === selectedCategory

    const matchesSearch =
      img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.description?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesCategory && matchesSearch
  })

  /* ✅ Optimized Cloudinary URL */
  const getOptimizedUrl = (
    publicId: string,
    size: 'thumbnail' | 'large' = 'thumbnail'
  ) => {
    const transformation =
      size === 'thumbnail'
        ? TRANSFORMATIONS.THUMBNAIL
        : TRANSFORMATIONS.GALLERY

    return getImageUrl(publicId, transformation)
  }

  /* ✅ Download Image */
  const downloadImage = (publicId: string, title: string) => {
    const url = getImageUrl(publicId, 'fl_attachment')
    const link = document.createElement('a')
    link.href = url
    link.download = `${title.replace(/\s+/g, '_')}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search gallery..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-red text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        {filteredImages.map((image, index) => (
          <div
            key={image.id}
            className="mb-4 break-inside-avoid group cursor-pointer"
            onClick={() => setSelectedImage(index)}
          >
            <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
              <div className="relative aspect-[4/3] bg-gray-100">
                <Image
                  src={getOptimizedUrl(image.publicId, 'thumbnail')}
                  alt={image.title}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-bold">{image.title}</h3>
                    <p className="text-sm opacity-90">{image.category}</p>
                    {image.date && (
                      <p className="text-xs opacity-75">{image.date}</p>
                    )}
                  </div>
                </div>

                {/* Download */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    downloadImage(image.publicId, image.title)
                  }}
                  className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-black/70"
                >
                  <FaDownload size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredImages.length === 0 && (
        <p className="text-center text-gray-500">No images found</p>
      )}

      {/* Lightbox */}
      {selectedImage !== null && filteredImages[selectedImage] && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <FaTimes size={28} />
            </button>

            <div className="relative h-[70vh] w-full">
              <img
                src={getOptimizedUrl(
                  filteredImages[selectedImage].publicId,
                  'large'
                )}
                alt={filteredImages[selectedImage].title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              <h3 className="text-xl font-bold">
                {filteredImages[selectedImage].title}
              </h3>
              <p className="text-gray-300">
                {filteredImages[selectedImage].category}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
