// components/Footer.tsx
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaYoutube, FaInstagram } from 'react-icons/fa'
import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary-navy text-white pt-12 pb-6">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* School Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-red to-primary-yellow rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">LH</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Little Heart</h3>
                <p className="text-sm text-gray-300">Public School</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Providing quality education with values since 1995. Nurturing future leaders of Bihar.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary-red transition">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="hover:text-primary-red transition">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="hover:text-primary-red transition">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
              <li><Link href="/academics" className="text-gray-300 hover:text-white">Academics</Link></li>
              <li><Link href="/admissions" className="text-gray-300 hover:text-white">Admissions</Link></li>
              <li><Link href="/facilities" className="text-gray-300 hover:text-white">Facilities</Link></li>
              <li><Link href="/gallery" className="text-gray-300 hover:text-white">Gallery</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white">Contact Us</Link></li>
            </ul>
          </div>

          {/* Important Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Important</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">School Calendar</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Academic Results</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Fee Structure</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Transport Routes</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Parent Login</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Careers</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-primary-red mt-1" />
                <div>
                  <p className="text-gray-300">
                    Near Power House Chowk<br />
                    Bara Chakia, East Champaran<br />
                    Bihar - 845412
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-primary-red" />
                <div>
                  <p className="text-gray-300">+91 75400 12345</p>
                  <p className="text-gray-300">+91 62000 12345</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-primary-red" />
                <p className="text-gray-300">info@littleheartschool.edu.in</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400">
            © {currentYear} Little Heart Public School. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Affiliated to CBSE New Delhi | School Code: 123456
          </p>
        </div>
      </div>
    </footer>
  )
}