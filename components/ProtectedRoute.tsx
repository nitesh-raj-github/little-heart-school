'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth } from '@/lib/firebase'
import { db } from '@/lib/firebase'
import Loader from './Loader'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace('/admin/login')
        setLoading(false)
        return
      }

      try {
        const adminSnap = await getDoc(doc(db, 'admins', user.uid))

        if (!adminSnap.exists() || !adminSnap.data().isActive) {
          await auth.signOut()
          router.replace('/admin/login')
          setLoading(false)
          return
        }

        setAuthorized(true)
      } catch (error) {
        console.error('Admin auth check failed:', error)
        await auth.signOut()
        router.replace('/admin/login')
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  if (loading) {
    return <Loader />
  }

  if (!authorized) {
    return <Loader />
  }

  return <>{children}</>
}
