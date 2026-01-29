// app/admin/admissions/page.tsx
'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaCheckCircle, 
  FaTimes,
  FaTimesCircle,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaSchool,
  FaUserGraduate,
  FaFileAlt,
  FaDownload,
  FaChartBar,
  FaComment,
  FaStar,
  FaClock,
  FaUserCheck
} from 'react-icons/fa'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

interface AdmissionApplication {
  id: number
  applicationId: string
  studentName: string
  fatherName: string
  motherName: string
  phone: string
  email: string
  applyingForClass: string
  previousSchool: string
  status: 'pending' | 'reviewed' | 'approved' | 'rejected' | 'waitlisted'
  appliedDate: string
  interactionDate?: string
  documents: string[]
  notes: string
  marksObtained?: string
  category: string
  address: string
  isPaid: boolean
  priority: 'high' | 'medium' | 'low'
}

const initialApplications: AdmissionApplication[] = [
  {
    id: 1,
    applicationId: 'LHS-2024-001',
    studentName: 'Rohan Kumar',
    fatherName: 'Mohan Kumar',
    motherName: 'Sunita Devi',
    phone: '+91 98765 43210',
    email: 'rohan@example.com',
    applyingForClass: 'Class 5',
    previousSchool: 'St. Mary School',
    status: 'pending',
    appliedDate: '2024-01-15',
    documents: ['Birth Certificate', 'Previous Marksheet', 'Aadhaar Card'],
    notes: 'Interested in sports facilities',
    marksObtained: '85%',
    category: 'General',
    address: 'Bara Chakia, East Champaran',
    isPaid: false,
    priority: 'high'
  },
  {
    id: 2,
    applicationId: 'LHS-2024-002',
    studentName: 'Priya Singh',
    fatherName: 'Ramesh Singh',
    motherName: 'Geeta Singh',
    phone: '+91 98765 43211',
    email: 'priya@example.com',
    applyingForClass: 'Class 8',
    previousSchool: 'DAV Public School',
    status: 'reviewed',
    appliedDate: '2024-01-10',
    interactionDate: '2024-01-20',
    documents: ['Birth Certificate', 'TC', 'Marksheet'],
    notes: 'Good academic record',
    marksObtained: '92%',
    category: 'OBC',
    address: 'Motihari, East Champaran',
    isPaid: true,
    priority: 'medium'
  },
  {
    id: 3,
    applicationId: 'LHS-2024-003',
    studentName: 'Amit Patel',
    fatherName: 'Sanjay Patel',
    motherName: 'Rekha Patel',
    phone: '+91 98765 43212',
    email: 'amit@example.com',
    applyingForClass: 'LKG',
    previousSchool: 'Kidzee Play School',
    status: 'approved',
    appliedDate: '2024-01-05',
    interactionDate: '2024-01-15',
    documents: ['Birth Certificate', 'Aadhaar Card'],
    notes: 'Parents both working professionals',
    marksObtained: 'N/A',
    category: 'General',
    address: 'Bara Chakia, East Champaran',
    isPaid: true,
    priority: 'low'
  },
  {
    id: 4,
    applicationId: 'LHS-2024-004',
    studentName: 'Sneha Sharma',
    fatherName: 'Rajesh Sharma',
    motherName: 'Neha Sharma',
    phone: '+91 98765 43213',
    email: 'sneha@example.com',
    applyingForClass: 'Class 10',
    previousSchool: 'Kendriya Vidyalaya',
    status: 'rejected',
    appliedDate: '2024-01-12',
    interactionDate: '2024-01-22',
    documents: ['All documents submitted'],
    notes: 'Age criteria not met',
    marksObtained: '78%',
    category: 'SC',
    address: 'Motihari, East Champaran',
    isPaid: false,
    priority: 'medium'
  },
  {
    id: 5,
    applicationId: 'LHS-2024-005',
    studentName: 'Vikram Yadav',
    fatherName: 'Suresh Yadav',
    motherName: 'Mina Yadav',
    phone: '+91 98765 43214',
    email: 'vikram@example.com',
    applyingForClass: 'Class 6',
    previousSchool: 'Little Flower School',
    status: 'waitlisted',
    appliedDate: '2024-01-18',
    interactionDate: '2024-01-25',
    documents: ['Birth Certificate', 'Marksheet'],
    notes: 'Waiting for seat vacancy',
    marksObtained: '88%',
    category: 'General',
    address: 'Bara Chakia, East Champaran',
    isPaid: false,
    priority: 'high'
  }
]

const statusOptions = ['All', 'pending', 'reviewed', 'approved', 'rejected', 'waitlisted']
const classOptions = ['All', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
const priorityOptions = ['All', 'high', 'medium', 'low']

export default function AdminAdmissionsPage() {
  const [applications, setApplications] = useState<AdmissionApplication[]>(initialApplications)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedClass, setSelectedClass] = useState('All')
  const [selectedPriority, setSelectedPriority] = useState('All')
  const [viewMode, setViewMode] = useState<'list' | 'details'>('list')
  const [selectedApplication, setSelectedApplication] = useState<AdmissionApplication | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<AdmissionApplication>>({})
  const [notes, setNotes] = useState('')
  const [quickStats, setQuickStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    waitlisted: 0,
    today: 0
  })

  // Calculate stats
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const stats = {
      total: applications.length,
      pending: applications.filter(app => app.status === 'pending').length,
      approved: applications.filter(app => app.status === 'approved').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
      waitlisted: applications.filter(app => app.status === 'waitlisted').length,
      today: applications.filter(app => app.appliedDate === today).length
    }
    setQuickStats(stats)
  }, [applications])

  // Filter applications
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone.includes(searchTerm)
    
    const matchesStatus = selectedStatus === 'All' || app.status === selectedStatus
    const matchesClass = selectedClass === 'All' || app.applyingForClass === selectedClass
    const matchesPriority = selectedPriority === 'All' || app.priority === selectedPriority
    
    return matchesSearch && matchesStatus && matchesClass && matchesPriority
  })

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'reviewed': return 'bg-blue-100 text-blue-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'waitlisted': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Update status
  const updateStatus = (id: number, status: AdmissionApplication['status']) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === id ? { ...app, status, interactionDate: new Date().toISOString().split('T')[0] } : app
      )
    )
    toast.success(`Status updated to ${status}`)
  }

  // Update payment status
  const updatePayment = (id: number, isPaid: boolean) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === id ? { ...app, isPaid } : app
      )
    )
    toast.success(`Payment status updated`)
  }

  // Add note
  const addNote = (id: number) => {
    if (!notes.trim()) return
    
    setApplications(prev => 
      prev.map(app => 
        app.id === id ? { ...app, notes: app.notes + '\n' + new Date().toLocaleString() + ': ' + notes } : app
      )
    )
    setNotes('')
    toast.success('Note added')
  }

  // Delete application
  const deleteApplication = (id: number) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      setApplications(prev => prev.filter(app => app.id !== id))
      toast.success('Application deleted')
    }
  }

  // View details
  const viewDetails = (app: AdmissionApplication) => {
    setSelectedApplication(app)
    setViewMode('details')
  }

  // Start editing
  const startEditing = (app: AdmissionApplication) => {
    setSelectedApplication(app)
    setEditData(app)
    setIsEditing(true)
  }

  // Save edit
  const saveEdit = () => {
    if (!selectedApplication || !editData) return
    
    setApplications(prev => 
      prev.map(app => 
        app.id === selectedApplication.id ? { ...app, ...editData } : app
      )
    )
    
    setIsEditing(false)
    setEditData({})
    toast.success('Application updated successfully')
  }

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      'Application ID',
      'Student Name',
      'Father Name',
      'Phone',
      'Email',
      'Applying For Class',
      'Previous School',
      'Status',
      'Applied Date',
      'Category',
      'Marks Obtained',
      'Payment Status'
    ]
    
    const csvData = applications.map(app => [
      app.applicationId,
      app.studentName,
      app.fatherName,
      app.phone,
      app.email,
      app.applyingForClass,
      app.previousSchool,
      app.status,
      app.appliedDate,
      app.category,
      app.marksObtained || 'N/A',
      app.isPaid ? 'Paid' : 'Pending'
    ])
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `admissions_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    toast.success('Data exported successfully')
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Admissions Management</h1>
                <p className="text-gray-600">Manage admission applications for 2024-25 session</p>
              </div>
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <FaDownload />
                Export CSV
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            {[
              { label: 'Total Applications', value: quickStats.total, color: 'bg-blue-500', icon: <FaFileAlt /> },
              { label: 'Pending', value: quickStats.pending, color: 'bg-yellow-500', icon: <FaClock /> },
              { label: 'Approved', value: quickStats.approved, color: 'bg-green-500', icon: <FaCheckCircle /> },
              { label: 'Rejected', value: quickStats.rejected, color: 'bg-red-500', icon: <FaTimesCircle /> },
              { label: 'Waitlisted', value: quickStats.waitlisted, color: 'bg-purple-500', icon: <FaUserCheck /> },
              { label: 'Today', value: quickStats.today, color: 'bg-indigo-500', icon: <FaCalendar /> }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                  <div className={`${stat.color} text-white p-3 rounded-lg`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {viewMode === 'list' ? (
            <>
              {/* Filters and Search */}
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
                  {/* Search */}
                  <div className="relative w-full lg:w-96">
                    <input
                      type="text"
                      placeholder="Search by name, application ID, or phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>

                  {/* Filters */}
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <FaFilter className="text-primary-red" />
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red"
                      >
                        {statusOptions.map(option => (
                          <option key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red"
                    >
                      {classOptions.map(option => (
                        <option key={option} value={option}>
                          {option === 'All' ? 'All Classes' : `Class ${option}`}
                        </option>
                      ))}
                    </select>

                    <select
                      value={selectedPriority}
                      onChange={(e) => setSelectedPriority(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red"
                    >
                      {priorityOptions.map(option => (
                        <option key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)} Priority
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Applications Table */}
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                      Applications ({filteredApplications.length})
                    </h2>
                    <div className="text-sm text-gray-600">
                      Showing {filteredApplications.length} of {applications.length} applications
                    </div>
                  </div>

                  {filteredApplications.length === 0 ? (
                    <div className="text-center py-12">
                      <FaFileAlt className="mx-auto text-gray-300 text-4xl mb-4" />
                      <p className="text-gray-500">No applications found matching your criteria</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Application ID</th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Student Details</th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Class</th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Status</th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Payment</th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Priority</th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredApplications.map((app) => (
                            <tr key={app.id} className="hover:bg-gray-50">
                              <td className="py-4 px-4">
                                <div className="font-medium text-primary-navy">{app.applicationId}</div>
                                <div className="text-sm text-gray-500">{app.appliedDate}</div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="font-medium text-gray-800">{app.studentName}</div>
                                <div className="text-sm text-gray-600">{app.fatherName}</div>
                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                  <FaPhone size={12} />
                                  {app.phone}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="font-medium">{app.applyingForClass}</div>
                                <div className="text-sm text-gray-500">{app.previousSchool}</div>
                                {app.marksObtained && (
                                  <div className="text-sm text-green-600">
                                    {app.marksObtained} marks
                                  </div>
                                )}
                              </td>
                              <td className="py-4 px-4">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                                  {app.status.toUpperCase()}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <button
                                  onClick={() => updatePayment(app.id, !app.isPaid)}
                                  className={`px-3 py-1 rounded text-sm font-medium ${
                                    app.isPaid
                                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                      : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                  }`}
                                >
                                  {app.isPaid ? 'Paid' : 'Pending'}
                                </button>
                              </td>
                              <td className="py-4 px-4">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(app.priority)}`}>
                                  {app.priority.toUpperCase()}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => viewDetails(app)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                    title="View Details"
                                  >
                                    <FaEye />
                                  </button>
                                  <button
                                    onClick={() => startEditing(app)}
                                    className="p-2 text-yellow-600 hover:bg-yellow-50 rounded"
                                    title="Edit"
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    onClick={() => deleteApplication(app.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                                    title="Delete"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="font-bold text-gray-800 mb-4">Quick Status Update</h3>
                  <div className="space-y-2">
                    {['pending', 'reviewed', 'approved', 'rejected', 'waitlisted'].map(status => (
                      <div key={status} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 capitalize">{status}</span>
                        <span className="text-sm font-medium">
                          {applications.filter(app => app.status === status).length}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="font-bold text-gray-800 mb-4">Class-wise Distribution</h3>
                  <div className="space-y-2">
                    {classOptions.slice(1).map(className => (
                      <div key={className} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Class {className}</span>
                        <span className="text-sm font-medium">
                          {applications.filter(app => app.applyingForClass === className).length}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="font-bold text-gray-800 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {applications.slice(0, 3).map(app => (
                      <div key={app.id} className="text-sm">
                        <div className="font-medium">{app.studentName}</div>
                        <div className="text-gray-500">Applied for {app.applyingForClass}</div>
                        <div className="text-xs text-gray-400">{app.appliedDate}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Application Details View */
            selectedApplication && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow"
              >
                {/* Header */}
                <div className="border-b p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <h2 className="text-2xl font-bold text-gray-800">
                          {selectedApplication.studentName}
                        </h2>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedApplication.status)}`}>
                          {selectedApplication.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-gray-600">
                        Application ID: {selectedApplication.applicationId} | 
                        Applied on: {selectedApplication.appliedDate}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setViewMode('list')}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Back to List
                      </button>
                      <button
                        onClick={() => startEditing(selectedApplication)}
                        className="px-4 py-2 bg-primary-red text-white rounded-lg hover:bg-red-600"
                      >
                        Edit Application
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Student Info */}
                    <div className="lg:col-span-2">
                      <div className="space-y-6">
                        {/* Personal Details */}
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FaUserGraduate />
                            Student Details
                          </h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-500">Full Name</label>
                              <p className="text-gray-800">{selectedApplication.studentName}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-500">Applying for Class</label>
                              <p className="text-gray-800">{selectedApplication.applyingForClass}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-500">Previous School</label>
                              <p className="text-gray-800">{selectedApplication.previousSchool}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-500">Marks Obtained</label>
                              <p className="text-gray-800">{selectedApplication.marksObtained || 'N/A'}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-500">Category</label>
                              <p className="text-gray-800">{selectedApplication.category}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-500">Payment Status</label>
                              <span className={`inline-block px-2 py-1 rounded text-sm ${
                                selectedApplication.isPaid
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {selectedApplication.isPaid ? 'Paid' : 'Pending'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Parent Details */}
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 mb-4">Parent Details</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-500">Father's Name</label>
                              <p className="text-gray-800">{selectedApplication.fatherName}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-500">Mother's Name</label>
                              <p className="text-gray-800">{selectedApplication.motherName}</p>
                            </div>
                          </div>
                        </div>

                        {/* Contact Information */}
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FaPhone />
                            Contact Information
                          </h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                              <div className="flex items-center gap-2">
                                <FaPhone className="text-gray-400" />
                                <a href={`tel:${selectedApplication.phone}`} className="text-blue-600 hover:underline">
                                  {selectedApplication.phone}
                                </a>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-500">Email Address</label>
                              <div className="flex items-center gap-2">
                                <FaEnvelope className="text-gray-400" />
                                <a href={`mailto:${selectedApplication.email}`} className="text-blue-600 hover:underline">
                                  {selectedApplication.email}
                                </a>
                              </div>
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-500">Address</label>
                              <p className="text-gray-800">{selectedApplication.address}</p>
                            </div>
                          </div>
                        </div>

                        {/* Documents */}
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 mb-4">Documents Submitted</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedApplication.documents.map((doc, index) => (
                              <span
                                key={index}
                                className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm"
                              >
                                {doc}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Notes */}
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 mb-4">Notes</h3>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-700 whitespace-pre-line">
                              {selectedApplication.notes || 'No notes added'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Actions */}
                    <div className="lg:col-span-1">
                      <div className="space-y-6">
                        {/* Status Actions */}
                        <div className="bg-gray-50 rounded-lg p-6">
                          <h3 className="font-bold text-gray-800 mb-4">Update Status</h3>
                          <div className="space-y-2">
                            {['pending', 'reviewed', 'approved', 'rejected', 'waitlisted'].map(status => (
                              <button
                                key={status}
                                onClick={() => updateStatus(selectedApplication.id, status as any)}
                                disabled={selectedApplication.status === status}
                                className={`w-full px-4 py-2 rounded text-left transition-colors ${
                                  selectedApplication.status === status
                                    ? 'bg-primary-red text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {status === 'approved' && <FaCheckCircle />}
                                  {status === 'rejected' && <FaTimesCircle />}
                                  {status === 'pending' && <FaClock />}
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Add Note */}
                        <div className="bg-gray-50 rounded-lg p-6">
                          <h3 className="font-bold text-gray-800 mb-4">Add Note</h3>
                          <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red"
                            placeholder="Add a note about this application..."
                          />
                          <button
                            onClick={() => addNote(selectedApplication.id)}
                            className="w-full mt-3 bg-primary-red text-white py-2 rounded-lg hover:bg-red-600"
                          >
                            Add Note
                          </button>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gray-50 rounded-lg p-6">
                          <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
                          <div className="space-y-3">
                            <button
                              onClick={() => updatePayment(selectedApplication.id, !selectedApplication.isPaid)}
                              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 text-left"
                            >
                              Mark as {selectedApplication.isPaid ? 'Unpaid' : 'Paid'}
                            </button>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(selectedApplication.applicationId)
                                toast.success('Application ID copied to clipboard')
                              }}
                              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 text-left"
                            >
                              Copy Application ID
                            </button>
                            <button
                              onClick={() => deleteApplication(selectedApplication.id)}
                              className="w-full px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 text-left"
                            >
                              Delete Application
                            </button>
                          </div>
                        </div>

                        {/* Application Timeline */}
                        <div className="bg-gray-50 rounded-lg p-6">
                          <h3 className="font-bold text-gray-800 mb-4">Timeline</h3>
                          <div className="space-y-4">
                            <div>
                              <div className="text-sm font-medium text-gray-700">Application Submitted</div>
                              <div className="text-xs text-gray-500">{selectedApplication.appliedDate}</div>
                            </div>
                            {selectedApplication.interactionDate && (
                              <div>
                                <div className="text-sm font-medium text-gray-700">Interaction Scheduled</div>
                                <div className="text-xs text-gray-500">{selectedApplication.interactionDate}</div>
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-700">Current Status</div>
                              <div className="text-xs text-gray-500">{selectedApplication.status.toUpperCase()}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          )}

          {/* Edit Modal */}
          {isEditing && selectedApplication && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Edit Application</h2>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FaTimes size={24} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Student Name
                        </label>
                        <input
                          type="text"
                          value={editData.studentName || ''}
                          onChange={(e) => setEditData({ ...editData, studentName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Father's Name
                        </label>
                        <input
                          type="text"
                          value={editData.fatherName || ''}
                          onChange={(e) => setEditData({ ...editData, fatherName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={editData.phone || ''}
                          onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={editData.email || ''}
                          onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Applying for Class
                        </label>
                        <select
                          value={editData.applyingForClass || ''}
                          onChange={(e) => setEditData({ ...editData, applyingForClass: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red"
                        >
                          {classOptions.slice(1).map(className => (
                            <option key={className} value={className}>Class {className}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <select
                          value={editData.category || ''}
                          onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red"
                        >
                          <option value="General">General</option>
                          <option value="OBC">OBC</option>
                          <option value="SC">SC</option>
                          <option value="ST">ST</option>
                          <option value="EWS">EWS</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Marks Obtained (%)
                        </label>
                        <input
                          type="text"
                          value={editData.marksObtained || ''}
                          onChange={(e) => setEditData({ ...editData, marksObtained: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red"
                          placeholder="e.g., 85%"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Priority
                        </label>
                        <select
                          value={editData.priority || 'medium'}
                          onChange={(e) => setEditData({ ...editData, priority: e.target.value as any })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red"
                        >
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        value={editData.address || ''}
                        onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes
                      </label>
                      <textarea
                        value={editData.notes || ''}
                        onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={saveEdit}
                        className="flex-1 bg-primary-red text-white py-3 rounded-lg font-medium hover:bg-red-600"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Section */}
          {viewMode === 'list' && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Admissions Analytics</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: 'Total Applications', value: quickStats.total, change: '+12%', color: 'text-blue-600' },
                  { title: 'Approval Rate', value: `${Math.round((quickStats.approved / quickStats.total) * 100) || 0}%`, change: '+5%', color: 'text-green-600' },
                  { title: 'Avg. Processing Time', value: '3 days', change: '-1 day', color: 'text-yellow-600' },
                  { title: 'Conversion Rate', value: '45%', change: '+8%', color: 'text-purple-600' }
                ].map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl shadow p-6">
                    <div className="text-sm text-gray-600">{stat.title}</div>
                    <div className="flex items-center justify-between mt-2">
                      <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                      <div className="text-sm text-green-600">{stat.change}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}