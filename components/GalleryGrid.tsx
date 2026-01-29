// components/GalleryGrid.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaChevronLeft, FaChevronRight, FaDownload } from 'react-icons/fa'

interface GalleryGridProps {
  images: Array<{
    id: string
    src: string
    alt: string
    title: string
    category: string
    date?: string
  }>
  categories?: string[]
  enableDownload?: boolean
}

export default function GalleryGrid({ 
  images, 
  categories = ['All', 'Campus', 'Classroom', 'Sports', 'Events', 'Cultural'],
  enableDownload = false 
}: GalleryGridProps) {
  const [selectedCategory, setSelectedCategory] = useState('All')
 const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredImages = images.filter(image => {
    const matchesCategory = selectedCategory === 'All' || image.category === selectedCategory
    const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         image.category.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const selectedImageData = selectedImage 
    ? images.find(img => img.id === selectedImage)
    : null

  const nextImage = () => {
    if (!selectedImage) return
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage)
    const nextIndex = (currentIndex + 1) % filteredImages.length
    setSelectedImage(filteredImages[nextIndex].id)
  }

  const prevImage = () => {
    if (!selectedImage) return
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage)
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length
    setSelectedImage(filteredImages[prevIndex].id)
  }

  const downloadImage = (src: string, title: string) => {
    const link = document.createElement('a')
    link.href = src
    link.download = `${title.replace(/\s+/g, '_')}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-primary-red text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search photos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-red w-64"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
      </div>

      {/* Gallery Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory + searchTerm}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="columns-1 sm:columns-2 lg:columns-3 gap-4"
        >
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className="mb-4 break-inside-avoid group cursor-pointer"
              onClick={() => setSelectedImage(image.id)}
            >
              <div className="relative overflow-hidden rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300">
                <div className="aspect-[4/3] relative bg-gradient-to-br from-gray-200 to-gray-300">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-bold text-lg">{image.title}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm opacity-90">{image.category}</span>
                        {image.date && (
                          <span className="text-xs opacity-75">{image.date}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {enableDownload && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        downloadImage(image.src, image.title)
                      }}
                      className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
                      title="Download image"
                    >
                      <FaDownload />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📷</div>
          <p className="text-gray-500 text-lg">No photos found matching your criteria</p>
          <p className="text-gray-400 mt-2">Try selecting a different category or search term</p>
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && selectedImageData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-6xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 z-10 p-2"
              >
                <FaTimes size={28} />
              </button>

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-3 bg-black/50 rounded-full hover:bg-black/70 transition-all"
              >
                <FaChevronLeft size={24} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-3 bg-black/50 rounded-full hover:bg-black/70 transition-all"
              >
                <FaChevronRight size={24} />
              </button>

              {/* Image */}
              <div className="relative h-[70vh] w-full">
                <Image
                  src={selectedImageData.src}
                  alt={selectedImageData.alt}
                  fill
                  className="object-contain"
                  sizes="90vw"
                />
              </div>

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{selectedImageData.title}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="px-3 py-1 bg-primary-red/20 text-primary-red rounded-full text-sm">
                        {selectedImageData.category}
                      </span>
                      {selectedImageData.date && (
                        <span className="text-gray-300 text-sm">{selectedImageData.date}</span>
                      )}
                    </div>
                  </div>
                  {enableDownload && (
                    <button
                      onClick={() => downloadImage(selectedImageData.src, selectedImageData.title)}
                      className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
                      title="Download image"
                    >
                      <FaDownload />
                    </button>
                  )}
                </div>
                <div className="flex justify-between items-center mt-4 text-sm text-gray-300">
                  <p>{selectedImageData.alt}</p>
                  <p>
                    {filteredImages.findIndex(img => img.id === selectedImage) + 1} / {filteredImages.length}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}