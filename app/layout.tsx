// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '../components/WhatsappButton'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Little Heart Public School - Bara Chakia, East Champaran',
  description:
    'Premium CBSE affiliated school in Bara Chakia, East Champaran, Bihar providing quality education from LKG to Class 10',
  keywords: [
    'school in bara chakia',
    'east champaran school',
    'CBSE school bihar',
    'best school champaran',
  ],
  authors: [{ name: 'Little Heart Public School' }],
  openGraph: {
    title: 'Little Heart Public School',
    description:
      'Where Every Child Matters - Nurturing Young Minds Since 2005',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Little Heart Public School',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <WhatsAppButton />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1d3557',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  )
}
