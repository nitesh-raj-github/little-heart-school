// components/Loader.tsx
'use client'

import { motion } from 'framer-motion'
import { FaHeart, FaGraduationCap, FaBookOpen } from 'react-icons/fa'

interface LoaderProps {
  message?: string
  fullScreen?: boolean
}

export default function Loader({ message = 'Loading...', fullScreen = true }: LoaderProps) {
  const content = (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        {/* Animated hearts */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-primary-red text-6xl mb-4"
        >
          <FaHeart />
        </motion.div>

        {/* Spinning ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-4 border-4 border-transparent border-t-primary-red border-r-primary-teal rounded-full"
        />

        {/* Floating icons */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-2 -right-2 text-primary-navy"
        >
          <FaGraduationCap />
        </motion.div>

        <motion.div
          animate={{ 
            y: [0, -15, 0],
            rotate: [360, 0, 360]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-2 -left-2 text-primary-teal"
        >
          <FaBookOpen />
        </motion.div>
      </div>

      {/* Loading text */}
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="mt-8 text-center"
      >
        <h3 className="text-xl font-bold text-primary-navy mb-2">
          Little Heart Public School
        </h3>
        <p className="text-gray-600">{message}</p>
        
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-2 h-2 bg-primary-red rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-cream to-white">
        {content}
      </div>
    )
  }

  return content
}