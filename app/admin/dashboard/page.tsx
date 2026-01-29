'use client'

import { useRouter } from 'next/navigation'
import { logout } from '@/lib/auth'
import { FaBookOpen, FaUserTie } from 'react-icons/fa'
import ProtectedRoute from '@/components/ProtectedRoute'
import {
  FaUsers,
  FaImage,
  FaCalendarAlt,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaSearch,
} from 'react-icons/fa'

const stats = [
  { label: 'Total Students', value: '542', icon: <FaUsers />, color: 'bg-blue-500' },
  { label: 'Active Teachers', value: '32', icon: <FaUsers />, color: 'bg-green-500' },
  { label: 'Gallery Photos', value: '156', icon: <FaImage />, color: 'bg-purple-500' },
  { label: 'Pending Applications', value: '23', icon: <FaCalendarAlt />, color: 'bg-yellow-500' },
]

const recentActivities = [
  { id: 1, action: 'New student registration', user: 'Parent Portal', time: '10 mins ago' },
  { id: 2, action: 'Gallery photo uploaded', user: 'Admin User', time: '1 hour ago' },
  { id: 3, action: 'Admission form submitted', user: 'Online Portal', time: '2 hours ago' },
  { id: 4, action: 'Content updated - About page', user: 'Content Manager', time: '1 day ago' },
]

export default function AdminDashboardPage() {
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.replace('/admin/login')
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        {/* Top Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600">
                  Little Heart Public School
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-red"
                  />
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>

                <button className="relative p-2 hover:bg-gray-100 rounded-full">
                  <FaBell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-red text-white rounded-lg hover:bg-red-600"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="p-6">
          {/* Stats */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className={`${stat.color} p-3 rounded-lg text-white`}>
                    {stat.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">Updated today</div>
              </div>
            ))}
          </div>

          {/* Quick Actions + Activities */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
             <div className="grid grid-cols-2 gap-4">
              
  {/* Gallery */}
  <button
    onClick={() => router.push('/admin/gallery')}
    className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 text-center"
  >
    <FaImage className="mx-auto mb-2" size={24} />
    Manage Gallery
  </button>

  {/* Slider */}
  <button
    onClick={() => router.push('/admin/slider')}
    className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 text-center"
  >
    <FaImage className="mx-auto mb-2" size={24} />
    Update Slider
  </button>

  {/* Faculty */}
  <button
    onClick={() => router.push('/admin/faculty')}
    className="p-4 bg-green-50 rounded-lg hover:bg-green-100 text-center"
  >
    <FaUsers className="mx-auto mb-2" size={24} />
    Manage Faculty
  </button>

  {/* Settings */}
  <button
    onClick={() => router.push('/admin/settings')}
    className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 text-center"
  >
    <FaCog className="mx-auto mb-2" size={24} />
    Settings
  </button>

  {/* ✅ NEW: School History */}
  <button
    onClick={() => router.push('/admin/about')}
    className="p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 text-center"
  >
    <FaBookOpen className="mx-auto mb-2" size={24} />
    School History
  </button>

  {/* ✅ NEW: Principal */}
  <button
    onClick={() => router.push('/admin/principal')}
    className="p-4 bg-pink-50 rounded-lg hover:bg-pink-100 text-center"
  >
    <FaUserTie className="mx-auto mb-2" size={24} />
    Principal
  </button>
</div>
</div>

            {/* Recent Activities */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-bold mb-4">Recent Activities</h3>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex justify-between border-b pb-3 last:border-none"
                  >
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-gray-500">
                        by {activity.user}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Overview */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-bold mb-4">System Overview</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold">99.5%</div>
                <p className="text-gray-600">System Uptime</p>
              </div>
              <div>
                <div className="text-2xl font-bold">245 GB</div>
                <p className="text-gray-600">Storage Used</p>
              </div>
              <div>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-gray-600">Monthly Visits</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
