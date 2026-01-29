// app/admin/settings/page.tsx
'use client'

import { useState } from 'react'
import ProtectedRoute from '../../../components/ProtectedRoute'
import { 
  FaSave, 
  FaUndo, 
  FaBell, 
  FaUser, 
  FaShieldAlt, 
  FaGlobe, 
  FaPalette 
  
} from 'react-icons/fa'

import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    // General Settings
    schoolName: 'Little Heart Public School',
    tagline: 'Where Every Child Matters',
    address: 'Near Power House Chowk, Bara Chakia, East Champaran, Bihar - 845412',
    contactEmail: 'info@littleheartschool.edu.in',
    contactPhone: '+91 75400 12345',
    
    // Website Settings
    maintenanceMode: false,
    enableWhatsApp: true,
    enableContactForm: true,
    enableOnlineAdmissions: true,
    
    // SEO Settings
    metaTitle: 'Little Heart Public School - Bara Chakia, East Champaran',
    metaDescription: 'Premium CBSE affiliated school in Bara Chakia, East Champaran, Bihar',
    metaKeywords: 'school, bara chakia, east champaran, bihar, cbse, education',
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: true,
    admissionAlerts: true,
    newsletter: true,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5
  })

  const [originalSettings] = useState(settings)

  const handleChange = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    // Save to backend in production
    toast.success('Settings saved successfully')
  }

  const handleReset = () => {
    setSettings(originalSettings)
    toast.success('Settings reset to default')
  }

  const sections = [
    {
      id: 'general',
      title: 'General Settings',
      icon: <FaGlobe />,
      description: 'School information and contact details'
    },
    {
      id: 'website',
      title: 'Website Settings',
      icon: <FaGlobe />,
      description: 'Website functionality and features'
    },
    {
      id: 'seo',
      title: 'SEO Settings',
      icon: <FaGlobe />,
      description: 'Search engine optimization settings'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <FaBell />,
      description: 'Email and SMS notification settings'
    },
    {
      id: 'security',
      title: 'Security',
      icon: <FaShieldAlt />,
      description: 'Security and authentication settings'
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: <FaPalette />,
      description: 'Website theme and colors'
    }
  ]

  const [activeSection, setActiveSection] = useState('general')

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">System Settings</h1>
            <p className="text-gray-600">Configure website and system settings</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow p-6 sticky top-6">
                <h2 className="text-lg font-bold mb-6">Settings Sections</h2>
                <div className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        activeSection === section.id
                          ? 'bg-primary-red text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {section.icon}
                        <div>
                          <div className="font-medium">{section.title}</div>
                          <div className="text-sm opacity-75">{section.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {sections.find(s => s.id === activeSection)?.title}
                    </h2>
                    <p className="text-gray-600">
                      {sections.find(s => s.id === activeSection)?.description}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    >
                      <FaUndo />
                      Reset
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-primary-red text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
                    >
                      <FaSave />
                      Save Changes
                    </button>
                  </div>
                </div>

                {/* Settings Form */}
                <div className="space-y-8">
                  {/* General Settings */}
                  {activeSection === 'general' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          School Name
                        </label>
                        <input
                          type="text"
                          value={settings.schoolName}
                          onChange={(e) => handleChange('general', 'schoolName', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tagline
                        </label>
                        <input
                          type="text"
                          value={settings.tagline}
                          onChange={(e) => handleChange('general', 'tagline', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <textarea
                          value={settings.address}
                          onChange={(e) => handleChange('general', 'address', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red"
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contact Email
                          </label>
                          <input
                            type="email"
                            value={settings.contactEmail}
                            onChange={(e) => handleChange('general', 'contactEmail', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contact Phone
                          </label>
                          <input
                            type="tel"
                            value={settings.contactPhone}
                            onChange={(e) => handleChange('general', 'contactPhone', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Website Settings */}
                  {activeSection === 'website' && (
                    <div className="space-y-6">
                      {[
                        { label: 'Maintenance Mode', field: 'maintenanceMode' },
                        { label: 'Enable WhatsApp Button', field: 'enableWhatsApp' },
                        { label: 'Enable Contact Form', field: 'enableContactForm' },
                        { label: 'Enable Online Admissions', field: 'enableOnlineAdmissions' }
                      ].map((item) => (
                        <div key={item.field} className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              {item.label}
                            </label>
                            <p className="text-sm text-gray-500">
                              {item.field === 'maintenanceMode' && 'Show maintenance page to visitors'}
                              {item.field === 'enableWhatsApp' && 'Show WhatsApp floating button'}
                              {item.field === 'enableContactForm' && 'Enable contact form submissions'}
                              {item.field === 'enableOnlineAdmissions' && 'Enable online admission form'}
                            </p>
                          </div>
                          <button
                            onClick={() => handleChange('website', item.field, !settings[item.field as keyof typeof settings])}
                            className={`w-12 h-6 rounded-full transition-colors ${
                              settings[item.field as keyof typeof settings] ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                              settings[item.field as keyof typeof settings] ? 'translate-x-7' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* SEO Settings */}
                  {activeSection === 'seo' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meta Title
                        </label>
                        <input
                          type="text"
                          value={settings.metaTitle}
                          onChange={(e) => handleChange('seo', 'metaTitle', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Title shown in search engines (50-60 characters recommended)
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meta Description
                        </label>
                        <textarea
                          value={settings.metaDescription}
                          onChange={(e) => handleChange('seo', 'metaDescription', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Description shown in search results (150-160 characters recommended)
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meta Keywords
                        </label>
                        <input
                          type="text"
                          value={settings.metaKeywords}
                          onChange={(e) => handleChange('seo', 'metaKeywords', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Comma-separated keywords for SEO
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Notification Settings */}
                  {activeSection === 'notifications' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold text-gray-800">Email Notifications</h3>
                      {[
                        { label: 'Enable Email Notifications', field: 'emailNotifications' },
                        { label: 'Send Admission Alerts', field: 'admissionAlerts' },
                        { label: 'Send Newsletter', field: 'newsletter' }
                      ].map((item) => (
                        <div key={item.field} className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              {item.label}
                            </label>
                          </div>
                          <button
                            onClick={() => handleChange('notifications', item.field, !settings[item.field as keyof typeof settings])}
                            className={`w-12 h-6 rounded-full transition-colors ${
                              settings[item.field as keyof typeof settings] ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                              settings[item.field as keyof typeof settings] ? 'translate-x-7' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>
                      ))}
                      
                      <h3 className="text-lg font-bold text-gray-800 mt-8">SMS Notifications</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Enable SMS Notifications
                          </label>
                          <p className="text-sm text-gray-500">
                            Send important alerts via SMS
                          </p>
                        </div>
                        <button
                          onClick={() => handleChange('notifications', 'smsNotifications', !settings.smsNotifications)}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            settings.smsNotifications ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                            settings.smsNotifications ? 'translate-x-7' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Security Settings */}
                  {activeSection === 'security' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Two-Factor Authentication
                          </label>
                          <p className="text-sm text-gray-500">
                            Require 2FA for admin login
                          </p>
                        </div>
                        <button
                          onClick={() => handleChange('security', 'twoFactorAuth', !settings.twoFactorAuth)}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            settings.twoFactorAuth ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                            settings.twoFactorAuth ? 'translate-x-7' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Session Timeout (minutes)
                        </label>
                        <input
                          type="number"
                          min="5"
                          max="120"
                          value={settings.sessionTimeout}
                          onChange={(e) => handleChange('security', 'sessionTimeout', parseInt(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password Expiry (days)
                        </label>
                        <input
                          type="number"
                          min="30"
                          max="365"
                          value={settings.passwordExpiry}
                          onChange={(e) => handleChange('security', 'passwordExpiry', parseInt(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Login Attempts
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={settings.loginAttempts}
                          onChange={(e) => handleChange('security', 'loginAttempts', parseInt(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red"
                        />
                      </div>
                    </div>
                  )}

                  {/* Appearance Settings */}
                  {activeSection === 'appearance' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Primary Color
                        </label>
                        <div className="flex gap-4">
                          {['#e63946', '#1d3557', '#2a9d8f', '#f4a261', '#264653'].map((color) => (
                            <button
                              key={color}
                              onClick={() => {
                                // Update CSS variables in production
                                toast.success('Color theme updated')
                              }}
                              className="w-12 h-12 rounded-full border-2 border-gray-300"
                              style={{ backgroundColor: color }}
                              title={`Color: ${color}`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Font Family
                        </label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red">
                          <option>Inter (Default)</option>
                          <option>Poppins</option>
                          <option>Roboto</option>
                          <option>Open Sans</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Theme Mode
                        </label>
                        <div className="flex gap-4">
                          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            Light
                          </button>
                          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            Dark
                          </button>
                          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            Auto
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Danger Zone */}
                {activeSection === 'security' && (
                  <div className="mt-12 pt-8 border-t border-red-200">
                    <h3 className="text-lg font-bold text-red-800 mb-4">Danger Zone</h3>
                    <div className="space-y-4">
                      <button className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100">
                        Clear All Cache
                      </button>
                      <button className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100">
                        Reset All Settings
                      </button>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                        Delete All Data
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}