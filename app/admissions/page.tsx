// app/admissions/page.tsx
'use client'

import { useState } from 'react'
import { FaDownload, FaCalendarAlt, FaFileAlt, FaCheckCircle, FaClock, FaUserGraduate } from 'react-icons/fa'
import { motion } from 'framer-motion'
import Link from 'next/link'

const admissionProcess = [
  {
    step: 1,
    title: 'Inquiry & Visit',
    description: 'Visit school campus or website for information',
    icon: '🏫'
  },
  {
    step: 2,
    title: 'Form Submission',
    description: 'Fill admission form online or collect from school',
    icon: '📝'
  },
  {
    step: 3,
    title: 'Documentation',
    description: 'Submit required documents for verification',
    icon: '📄'
  },
  {
    step: 4,
    title: 'Interaction & Assessment',
    description: 'Student interaction (if applicable)',
    icon: '👨‍🏫'
  },
  {
    step: 5,
    title: 'Fee Payment',
    description: 'Complete admission formalities and fee payment',
    icon: '💰'
  },
  {
    step: 6,
    title: 'Welcome Kit',
    description: 'Receive school kit and uniform',
    icon: '🎒'
  }
]

const requiredDocuments = [
  'Birth Certificate (Original & Photocopy)',
  'Aadhaar Card of Student',
  'Aadhaar Card of Parents',
  'Previous School Transfer Certificate',
  'Previous Year Report Card',
  'Passport Size Photographs (4 copies)',
  'Address Proof',
  'Caste Certificate (if applicable)'
]

const feeStructure = [
  { class: 'LKG/UKG', admission: '₹5,000', tuition: '₹15,000/year' },
  { class: 'Class 1-5', admission: '₹5,000', tuition: '₹18,000/year' },
  { class: 'Class 6-8', admission: '₹5,000', tuition: '₹22,000/year' },
  { class: 'Class 9-10', admission: '₹5,000', tuition: '₹25,000/year' }
]

export default function AdmissionsPage() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <div className="pt-20 pb-16">
      {/* Hero Section */}
      <section className="relative h-[40vh] bg-gradient-to-r from-primary-navy to-primary-teal mb-12">
        <div className="absolute inset-0 bg-black/40">
          <div className="container-custom h-full flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Admissions 2024-25</h1>
              <p className="text-xl mb-8">Shaping Futures, One Student at a Time</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/admissions/online" className="btn-primary">
                  Apply Online Now
                </Link>
                <button className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-full font-semibold hover:bg-white/30 transition border border-white/30">
                  Download Prospectus
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admission Open Banner */}
      <div className="container-custom mb-12">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-center text-white shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-left">
              <h2 className="text-2xl font-bold mb-2">Admissions Open for 2024-25 Session</h2>
              <p className="flex items-center gap-2">
                <FaCalendarAlt />
                Last Date: 31st March 2024
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link href="/admissions/online" className="bg-white text-emerald-700 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-lg">
                Apply Now →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Process */}
          <div className="lg:col-span-2">
            {/* Admission Process */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <FaCheckCircle className="text-primary-red text-2xl" />
                <h2 className="text-2xl font-bold text-gray-800">Admission Process</h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {admissionProcess.map((step, index) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setActiveStep(index)}
                    className={`p-6 rounded-xl cursor-pointer transition-all ${
                      activeStep === index
                        ? 'bg-primary-red text-white shadow-2xl transform -translate-y-1'
                        : 'bg-white text-gray-800 shadow-lg hover:shadow-xl hover:-translate-y-1'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`text-2xl ${activeStep === index ? 'text-white' : 'text-primary-red'}`}>
                        {step.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            activeStep === index
                              ? 'bg-white text-primary-red'
                              : 'bg-primary-red text-white'
                          }`}>
                            {step.step}
                          </div>
                          <h3 className="font-bold">{step.title}</h3>
                        </div>
                        <p className={`text-sm ${activeStep === index ? 'text-white/90' : 'text-gray-600'}`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Eligibility Criteria */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Eligibility Criteria</h2>
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-bold mb-4 text-primary-navy">Age Criteria</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary-red rounded-full"></div>
                        <span className="text-gray-700">LKG: 3.5 - 4.5 years</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary-red rounded-full"></div>
                        <span className="text-gray-700">UKG: 4.5 - 5.5 years</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary-red rounded-full"></div>
                        <span className="text-gray-700">Class 1: 5.5 - 6.5 years</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary-red rounded-full"></div>
                        <span className="text-gray-700">Add 1 year for each higher class</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-4 text-primary-navy">Academic Requirements</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary-red rounded-full"></div>
                        <span className="text-gray-700">Previous class passing certificate</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary-red rounded-full"></div>
                        <span className="text-gray-700">No pending backlogs</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary-red rounded-full"></div>
                        <span className="text-gray-700">Minimum 50% marks in previous class</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary-red rounded-full"></div>
                        <span className="text-gray-700">Good conduct certificate</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Important Info */}
          <div>
            {/* Fee Structure */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <h3 className="text-lg font-bold mb-4 text-primary-navy">Fee Structure</h3>
              <div className="space-y-4">
                {feeStructure.map((fee, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-3">
                    <span className="font-medium text-gray-800">{fee.class}</span>
                    <div className="text-right">
                      <div className="text-primary-red font-bold">{fee.tuition}</div>
                      <div className="text-sm text-gray-600">Admission: {fee.admission}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t">
                <p className="text-sm text-gray-600">
                  * Transport fee extra based on distance<br />
                  * Includes books, uniform, and activities
                </p>
              </div>
            </div>

            {/* Required Documents */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <FaFileAlt className="text-primary-red" />
                <h3 className="text-lg font-bold text-primary-navy">Required Documents</h3>
              </div>
              <ul className="space-y-2">
                {requiredDocuments.map((doc, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-primary-red mt-1">•</span>
                    {doc}
                  </li>
                ))}
              </ul>
              <button className="w-full mt-4 flex items-center justify-center gap-2 bg-primary-navy text-white py-2 rounded-lg hover:bg-blue-900 transition">
                <FaDownload />
                Download Checklist
              </button>
            </div>

            {/* Important Dates */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaClock className="text-primary-red" />
                <h3 className="text-lg font-bold text-primary-navy">Important Dates</h3>
              </div>
              <div className="space-y-4">
                {[
                  { event: 'Application Start', date: '1st Jan 2024' },
                  { event: 'Last Date for Forms', date: '31st Mar 2024' },
                  { event: 'Interaction Sessions', date: '1st-10th Apr 2024' },
                  { event: 'Result Declaration', date: '15th Apr 2024' },
                  { event: 'Fee Payment Deadline', date: '30th Apr 2024' },
                  { event: 'Session Commences', date: '1st Jun 2024' }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-700">{item.event}</span>
                    <span className="font-medium text-primary-navy">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scholarship Section */}
        <section className="mt-12 py-8 px-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Scholarships Available</h2>
              <p className="text-gray-600">
                Merit-based and need-based scholarships for deserving students
              </p>
            </div>
            <button className="mt-4 md:mt-0 bg-yellow-500 text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-yellow-600 transition shadow-lg">
              Check Eligibility
            </button>
          </div>
        </section>

        {/* Contact Admissions */}
        <section className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Need Help with Admissions?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our admission team is available to assist you from Monday to Saturday, 9 AM to 3 PM
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="tel:+917540012345" className="btn-primary">
              Call Admissions: +91 75400 12345
            </a>
            <a href="mailto:admissions@littleheartschool.edu.in" className="btn-secondary">
              Email Admissions
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}