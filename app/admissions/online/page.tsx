// app/admissions/online/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaUser, FaPhone, FaEnvelope, FaCalendar, FaSchool, FaMapMarkerAlt, FaUpload } from 'react-icons/fa'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function OnlineAdmissions() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    // Step 1: Student Information
    studentName: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    religion: '',
    category: '',
    
    // Step 2: Academic Information
    applyingForClass: '',
    previousSchool: '',
    previousClass: '',
    marksObtained: '',
    board: '',
    
    // Step 3: Parent Information
    fatherName: '',
    fatherOccupation: '',
    fatherPhone: '',
    fatherEmail: '',
    motherName: '',
    motherOccupation: '',
    motherPhone: '',
    motherEmail: '',
    
    // Step 4: Contact Information
    address: '',
    city: '',
    pincode: '',
    emergencyContact: '',
    
    // Step 5: Documents
    documents: {
      birthCertificate: null as File | null,
      previousMarksheet: null as File | null,
      aadhaarCard: null as File | null,
      photograph: null as File | null
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('File size should be less than 2MB')
        return
      }
      
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [field]: file
        }
      }))
    }
  }

  const nextStep = () => {
    // Validate current step
    if (step === 1) {
      if (!formData.studentName || !formData.dateOfBirth || !formData.gender) {
        toast.error('Please fill all required fields in Student Information')
        return
      }
    }
    if (step === 2) {
      if (!formData.applyingForClass || !formData.previousSchool) {
        toast.error('Please fill all required fields in Academic Information')
        return
      }
    }
    if (step === 3) {
      if (!formData.fatherName || !formData.fatherPhone || !formData.motherName) {
        toast.error('Please fill all required fields in Parent Information')
        return
      }
    }
    if (step === 4) {
      if (!formData.address || !formData.city || !formData.pincode) {
        toast.error('Please fill all required fields in Contact Information')
        return
      }
    }
    
    setStep(prev => Math.min(prev + 1, 5))
  }

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Application submitted successfully! We will contact you soon.')
      setLoading(false)
      router.push('/admissions')
    }, 2000)
  }

  const steps = [
    { number: 1, title: 'Student Info', icon: <FaUser /> },
    { number: 2, title: 'Academic Info', icon: <FaSchool /> },
    { number: 3, title: 'Parent Info', icon: <FaUser /> },
    { number: 4, title: 'Contact Info', icon: <FaMapMarkerAlt /> },
    { number: 5, title: 'Documents', icon: <FaUpload /> }
  ]

  return (
    <div className="pt-20 pb-16">
      {/* Progress Bar */}
      <div className="bg-white shadow-sm">
        <div className="container-custom py-6">
          <div className="flex justify-between items-center">
            {steps.map((stepItem, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step > stepItem.number ? 'bg-green-500 text-white' :
                  step === stepItem.number ? 'bg-primary-red text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {stepItem.icon}
                </div>
                <div className={`ml-3 ${step >= stepItem.number ? 'text-gray-800' : 'text-gray-400'}`}>
                  <div className="font-medium">Step {stepItem.number}</div>
                  <div className="text-sm">{stepItem.title}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 w-16 mx-4 ${
                    step > stepItem.number ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-custom mt-8">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Form Header */}
          <div className="bg-primary-navy text-white p-8">
            <h1 className="text-3xl font-bold mb-2">Online Admission Form</h1>
            <p>Session 2024-25 | Little Heart Public School</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {/* Step 1: Student Information */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Student Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student Full Name *
                    </label>
                    <input
                      type="text"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nationality
                    </label>
                    <input
                      type="text"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                      placeholder="Indian"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Religion
                    </label>
                    <input
                      type="text"
                      name="religion"
                      value={formData.religion}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      <option value="General">General</option>
                      <option value="OBC">OBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                      <option value="EWS">EWS</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Academic Information */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Academic Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Applying for Class *
                    </label>
                    <select
                      name="applyingForClass"
                      value={formData.applyingForClass}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                      required
                    >
                      <option value="">Select Class</option>
                      {['LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map(grade => (
                        <option key={grade} value={grade}>Class {grade}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Previous School Name *
                    </label>
                    <input
                      type="text"
                      name="previousSchool"
                      value={formData.previousSchool}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Previous Class
                    </label>
                    <input
                      type="text"
                      name="previousClass"
                      value={formData.previousClass}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marks Obtained (%)
                    </label>
                    <input
                      type="number"
                      name="marksObtained"
                      value={formData.marksObtained}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Board/Curriculum
                    </label>
                    <input
                      type="text"
                      name="board"
                      value={formData.board}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                      placeholder="e.g., CBSE, ICSE, Bihar Board"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Parent Information */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Parent Information</h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Father&apos;s Details</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Father&apos;s Name *
                        </label>
                        <input
                          type="text"
                          name="fatherName"
                          value={formData.fatherName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Occupation
                        </label>
                        <input
                          type="text"
                          name="fatherOccupation"
                          value={formData.fatherOccupation}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          name="fatherPhone"
                          value={formData.fatherPhone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="fatherEmail"
                          value={formData.fatherEmail}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Mother&apos;s Details</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mother&apos;s Name *
                        </label>
                        <input
                          type="text"
                          name="motherName"
                          value={formData.motherName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Occupation
                        </label>
                        <input
                          type="text"
                          name="motherOccupation"
                          value={formData.motherOccupation}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          name="motherPhone"
                          value={formData.motherPhone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="motherEmail"
                          value={formData.motherEmail}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Contact Information */}
            {step === 4 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Complete Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                      required
                      placeholder="House No., Street, Village/Town"
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City/Town *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        pattern="[0-9]{6}"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Contact *
                      </label>
                      <input
                        type="tel"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Documents */}
            {step === 5 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Documents</h2>
                <p className="text-gray-600 mb-6">
                  Upload scanned copies of the following documents (Max 2MB each, PDF/JPG/PNG)
                </p>
                
                <div className="space-y-6">
                  {[
                    { 
                      field: 'birthCertificate',
                      label: 'Birth Certificate *',
                      accept: '.pdf,.jpg,.jpeg,.png'
                    },
                    { 
                      field: 'previousMarksheet',
                      label: 'Previous Class Marksheet *',
                      accept: '.pdf,.jpg,.jpeg,.png'
                    },
                    { 
                      field: 'aadhaarCard',
                      label: 'Student Aadhaar Card',
                      accept: '.pdf,.jpg,.jpeg,.png'
                    },
                    { 
                      field: 'photograph',
                      label: 'Passport Size Photograph *',
                      accept: '.jpg,.jpeg,.png'
                    }
                  ].map((doc, index) => (
                    <div key={index} className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary-red transition-colors">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {doc.label}
                      </label>
                      <input
                        type="file"
                        accept={doc.accept}
                        onChange={handleFileChange(doc.field)}
                        className="w-full"
                      />
                      {formData.documents[doc.field as keyof typeof formData.documents] && (
                        <p className="text-sm text-green-600 mt-2">
                          ✓ File uploaded: {formData.documents[doc.field as keyof typeof formData.documents]?.name}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Declaration */}
                <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="declaration"
                      required
                      className="mt-1"
                    />
                    <label htmlFor="declaration" className="text-gray-700">
                      I hereby declare that all information provided in this application is true and correct to the best of my knowledge. 
                      I understand that any false information may lead to cancellation of admission.
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  ← Previous
                </button>
              )}
              
              {step < 5 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto btn-primary"
                >
                  Next Step →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto btn-primary flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Help Section */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-xl">
            <h3 className="font-bold text-blue-800 mb-2">Need Help?</h3>
            <p className="text-blue-600 text-sm">
              Call Admissions Office:<br />
              <strong>+91 75400 12345</strong>
            </p>
          </div>
          <div className="bg-green-50 p-6 rounded-xl">
            <h3 className="font-bold text-green-800 mb-2">Application Status</h3>
            <p className="text-green-600 text-sm">
              Track your application using the reference number sent via SMS/Email
            </p>
          </div>
          <div className="bg-purple-50 p-6 rounded-xl">
            <h3 className="font-bold text-purple-800 mb-2">Important</h3>
            <p className="text-purple-600 text-sm">
              Bring original documents for verification during school visit
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}