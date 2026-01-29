// app/contact/page.tsx
'use client'

import { useState } from 'react'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane } from 'react-icons/fa'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const contactInfo = [
  {
    icon: <FaMapMarkerAlt />,
    title: 'School Address',
    details: [
      'Little Heart Public School',
      'Near Power House Chowk',
      'Bara Chakia, East Champaran',
      'Bihar - 845412'
    ]
  },
  {
    icon: <FaPhone />,
    title: 'Phone Numbers',
    details: [
      'Principal: +91 62000 12345',
      'Office: +91 75400 12345',
      'Transport: +91 98000 12345',
      'Fax: +91 612 345678'
    ]
  },
  {
    icon: <FaEnvelope />,
    title: 'Email Address',
    details: [
      'info@littleheartschool.edu.in',
      'principal@littleheartschool.edu.in',
      'admissions@littleheartschool.edu.in',
      'accounts@littleheartschool.edu.in'
    ]
  },
  {
    icon: <FaClock />,
    title: 'Office Hours',
    details: [
      'Monday - Friday: 8:00 AM - 4:00 PM',
      'Saturday: 8:00 AM - 1:00 PM',
      'Sunday: Closed',
      'Admission Enquiry: 9:00 AM - 3:00 PM'
    ]
  }
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    studentClass: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Form validation
    if (!formData.name || !formData.phone || !formData.message) {
      toast.error('Please fill in all required fields')
      return
    }

    // Simulate form submission
    toast.loading('Sending your message...')
    
    setTimeout(() => {
      toast.dismiss()
      toast.success('Message sent successfully! We will contact you soon.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        studentClass: ''
      })
    }, 2000)
  }

  return (
    <div className="pt-20 pb-16">
      {/* Hero Section */}
      <section className="relative h-[30vh] bg-gradient-to-r from-primary-navy to-primary-teal mb-12">
        <div className="absolute inset-0 bg-black/40">
          <div className="container-custom h-full flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
              <p className="text-xl">We&apos;re here to help you with any questions</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container-custom">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-xl p-6 sticky top-24"
            >
              <h2 className="text-2xl font-bold mb-6 text-primary-navy">Get in Touch</h2>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="p-3 bg-primary-red/10 text-primary-red rounded-lg">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">{info.title}</h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600 text-sm mb-1">{detail}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Map */}
              <div className="mt-8">
                <h3 className="font-bold text-gray-800 mb-4">Find Us on Map</h3>
                <div className="rounded-xl overflow-hidden h-48 bg-gray-200">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3568.233352524437!2d85.0643!3d26.4499!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed3b7c15d2c0a1%3A0x3e1f3b4c5d6e7f8!2sPower%20House%20Chowk%2C%20Bara%20Chakia%2C%20East%20Champaran%2C%20Bihar%20845412!5e0!3m2!1sen!2sin!4v1706357603210!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="School Location"
                    className="filter grayscale hover:grayscale-0 transition-all"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Click &quot;View Larger Map&quot; for detailed directions
                </p>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold mb-2 text-primary-navy">Send us a Message</h2>
              <p className="text-gray-600 mb-8">
                Have questions about admissions, facilities, or anything else? We&apos;re here to help!
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent transition-all"
                      placeholder="10-digit mobile number"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent transition-all"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student&apos;s Class (if applicable)
                    </label>
                    <select
                      name="studentClass"
                      value={formData.studentClass}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent transition-all"
                    >
                      <option value="">Select Class</option>
                      <option value="LKG">LKG</option>
                      <option value="UKG">UKG</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(grade => (
                        <option key={grade} value={`Class ${grade}`}>Class {grade}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent transition-all"
                    placeholder="What is this regarding?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent transition-all"
                    placeholder="Please write your message here..."
                    required
                  />
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    className="btn-primary flex items-center gap-2"
                  >
                    <FaPaperPlane />
                    Send Message
                  </button>
                  <p className="text-sm text-gray-500">
                    * Required fields
                  </p>
                </div>
              </form>

              {/* Emergency Contact */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-red-800 mb-2">🚨 Emergency Contact</h3>
                  <p className="text-red-700 mb-2">
                    For emergencies during school hours, please contact:
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="text-red-800">
                      <FaPhone />
                    </div>
                    <div>
                      <p className="font-bold text-red-800">+91 98765 43210</p>
                      <p className="text-sm text-red-600">Available 24/7 for school-related emergencies</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}