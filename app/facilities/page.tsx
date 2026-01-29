// app/facilities/page.tsx
'use client'
import { useState } from 'react'
import { FaDesktop, FaBook, FaFlask, FaFutbol, FaBus, FaTree, FaUtensils, FaShieldAlt, FaWifi, FaFirstAid , FaHome, } from 'react-icons/fa'
import { motion } from 'framer-motion'
import Image from 'next/image'

const facilities = [
  {
    icon: <FaDesktop />,
    title: 'Smart Classrooms',
    description: 'Digitally equipped classrooms with interactive panels and audio-visual aids',
    features: ['Digital boards', 'Projector systems', 'Audio systems', 'Internet connectivity'],
    image: '/images/facilities/smart-class.jpg'
  },
  {
    icon: <FaBook />,
    title: 'Library & Reading Room',
    description: 'Well-stocked library with vast collection of books and digital resources',
    features: ['5000+ books', 'Reference section', 'Digital library', 'Reading room'],
    image: '/images/facilities/library.jpg'
  },
  {
    icon: <FaFlask />,
    title: 'Science Laboratories',
    description: 'Well-equipped labs for Physics, Chemistry, Biology, and Computer Science',
    features: ['Modern equipment', 'Safety protocols', 'Practical learning', 'Computer lab'],
    image: '/images/facilities/lab.jpg'
  },
  {
    icon: <FaFutbol />,
    title: 'Sports Complex',
    description: 'Indoor and outdoor sports facilities for physical development',
    features: ['Football ground', 'Basketball court', 'Indoor games', 'Annual sports meet'],
    image: '/images/facilities/sports.jpg'
  },
  {
  icon: <FaBus className="text-2xl" />,
  title: 'School Transport System',
  description: 'Safe, reliable and efficient transportation network covering 20km radius',
  features: [
    'Fleet of 12 GPS-enabled buses',
    'Female attendants on each bus',
    'Real-time tracking for parents',
    'Regular vehicle maintenance',
    'First-aid kits in all vehicles',
    'Trained drivers with valid licenses',
    'Seat belts for all students',
    'Pickup from designated safe points',
    'Route optimization software',
    'Emergency contact system'
  ],
  coverage: [
    'Main city areas',
    'Surrounding villages (upto 20km)',
    'Major residential colonies',
    'Special routes on request'
  ],
  image: '/images/facilities/transport.jpg'
},
  {
    icon: <FaTree />,
    title: 'Green Campus',
    description: 'Eco-friendly 2-acre campus with gardens and play areas',
    features: ['Organic garden', 'Playground', 'Amphitheater', 'Solar panels'],
    image: '/images/facilities/campus.jpg'
  },
  {
    icon: <FaUtensils />,
    title: 'Cafeteria',
    description: 'Hygienic and nutritious food prepared in modern kitchen',
    features: ['Healthy snacks', 'Drinking water', 'Quality checked', 'Vegetarian only'],
    image: '/images/facilities/cafeteria.jpg'
  },
  {
    icon: <FaShieldAlt />,
    title: 'Safety & Security',
    description: '24/7 security with comprehensive safety measures',
    features: ['CCTV surveillance', 'Security personnel', 'Fire safety', 'First aid'],
    image: '/images/facilities/security.jpg'
  },

   // Detailed version for the hostel facility
{
  icon: <FaHome className="text-2xl" />,
  title: 'Boys Residential Hostel',
  description: 'A home away from home with comprehensive residential facilities',
  features: [
    'Spacious dormitories with attached bathrooms',
    '24/7 security and CCTV surveillance',
    'Nutritious vegetarian meals (breakfast, lunch, dinner, snacks)',
    'Dedicated study hours with teacher supervision',
    'Recreational room with TV, indoor games',
    'Laundry and housekeeping services',
    'Regular medical check-ups',
    'Weekend recreational activities',
    'Wi-Fi connectivity in common areas',
    'Parent visitation facility'
  ],
  highlights: [
    'Homely atmosphere with caring wardens',
    'Focus on discipline and routine',
    'Academic support and mentoring',
    'Cultural and sports activities',
    'Regular parent-teacher meetings'
  ],
  image: '/images/facilities/hostel.jpg'
}
]

export default function FacilitiesPage() {
  const [activeFacility, setActiveFacility] = useState(0)

  return (
    <div className="pt-20 pb-16">
      {/* Hero Section */}
      <section className="relative h-[30vh] bg-gradient-to-r from-primary-navy to-primary-teal mb-12">
        <div className="absolute inset-0 bg-black/40">
          <div className="container-custom h-full flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Facilities</h1>
              <p className="text-xl">World-Class Infrastructure for Holistic Development</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Facilities */}
      <section className="py-12">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Facilities</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              State-of-the-art infrastructure designed to provide the best learning environment
            </p>
          </div>

          {/* Facilities Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((facility, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveFacility(index)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-xl text-center transition-all ${
                  activeFacility === index
                    ? 'bg-primary-red text-white shadow-2xl transform -translate-y-1'
                    : 'bg-white text-gray-800 shadow-lg hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                <div className={`text-3xl mb-4 ${
                  activeFacility === index ? 'text-white' : 'text-primary-red'
                }`}>
                  {facility.icon}
                </div>
                <h3 className="font-bold text-lg">{facility.title}</h3>
              </motion.button>
            ))}
          </div>

          {/* Active Facility Details */}
          <motion.div
            key={activeFacility}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="md:flex">
              {/* Image */}
              <div className="md:w-2/5 relative h-64 md:h-auto">
                <Image
                  src={facilities[activeFacility].image}
                  alt={facilities[activeFacility].title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:hidden">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{facilities[activeFacility].title}</h3>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="md:w-3/5 p-8">
                <h3 className="text-2xl font-bold text-primary-navy mb-4">
                  {facilities[activeFacility].title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {facilities[activeFacility].description}
                </p>

                <h4 className="text-lg font-bold mb-3 text-gray-800">Key Features:</h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {facilities[activeFacility].features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary-red rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Additional Info */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary-red/10 p-3 rounded-lg">
                      <FaFirstAid className="text-primary-red" />
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-800">Safety First</h5>
                      <p className="text-sm text-gray-600">
                        All facilities comply with safety standards and are regularly inspected
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Infrastructure Highlights */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Infrastructure Highlights</h2>
            <p className="text-gray-600">Modern amenities for enhanced learning experience</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '💡',
                title: 'Digital Infrastructure',
                points: ['Smart classrooms', 'Computer lab', 'High-speed internet', 'Audio-visual room']
              },
              {
                icon: '🏛️',
                title: 'Physical Infrastructure',
                points: ['Spacious classrooms', 'Science labs', 'Library', 'Administrative block']
              },
              {
                icon: '🎯',
                title: 'Special Facilities',
                points: ['Medical room', 'Counseling center', 'Activity rooms', 'Resource center']
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">{item.title}</h3>
                <ul className="space-y-2">
                  {item.points.map((point, idx) => (
                    <li key={idx} className="text-gray-600 flex items-center gap-2">
                      <span className="text-primary-red">✓</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Virtual Tour CTA */}
      <section className="py-16">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-primary-navy to-primary-teal rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Experience Our Campus</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Take a virtual tour of our state-of-the-art facilities from the comfort of your home
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="bg-white text-primary-navy px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg">
                Schedule Campus Visit
              </button>
              <button className="bg-primary-red text-white px-8 py-3 rounded-full font-semibold hover:bg-red-600 transition shadow-lg">
                Start Virtual Tour
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}