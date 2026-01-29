'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

interface ImageSliderProps {
  images: Array<{
    src: string
    alt: string
    caption?: string
  }>
  autoPlay?: boolean
  interval?: number
}

export default function ImageSlider({
  images,
  autoPlay = true,
  interval = 5000
}: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [hasError, setHasError] = useState(false)

  const isCloudinary =
    images[currentIndex]?.src?.includes('cloudinary.com')

  /* ================= SLIDE CONTROLS ================= */

  const nextSlide = useCallback(() => {
    if (images.length === 0) return
    setHasError(false)
    setCurrentIndex(i => (i === images.length - 1 ? 0 : i + 1))
  }, [images.length])

  const prevSlide = () => {
    if (images.length === 0) return
    setHasError(false)
    setCurrentIndex(i => (i === 0 ? images.length - 1 : i - 1))
  }

  const goToSlide = (index: number) => {
    setHasError(false)
    setCurrentIndex(index)
  }

  /* ================= AUTOPLAY ================= */

  useEffect(() => {
    if (!autoPlay || isHovering || images.length <= 1) return
    const timer = setInterval(nextSlide, interval)
    return () => clearInterval(timer)
  }, [autoPlay, interval, nextSlide, isHovering, images.length])

  /* ================= EMPTY STATE ================= */

  if (images.length === 0) {
    return (
      <div className="relative w-full h-[600px] bg-gray-200 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <div className="text-4xl mb-2">📷</div>
          <p className="font-semibold">No slider images</p>
          <p className="text-sm">Upload from admin panel</p>
        </div>
      </div>
    )
  }

  /* ================= RENDER ================= */

  return (
    <div
      className="relative w-full h-[600px] md:h-[700px] overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <Image
            src={
              hasError
                ? '/images/fallback-slide.jpg'
                : images[currentIndex].src
            }
            alt={images[currentIndex].alt}
            fill
            priority={currentIndex === 0}
            sizes="100vw"
            className="object-cover"
            unoptimized={isCloudinary}
            onError={() => setHasError(true)}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Caption */}
          {images[currentIndex].caption && (
            <div className="absolute bottom-0 w-full p-8 text-center">
              <h2 className="text-white text-2xl md:text-3xl font-bold drop-shadow">
                {images[currentIndex].caption}
              </h2>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full z-10"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full z-10"
          >
            <FaChevronRight />
          </button>
        </>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`w-3 h-3 rounded-full transition ${
                i === currentIndex
                  ? 'bg-white scale-125'
                  : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute top-6 right-6 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  )
}
