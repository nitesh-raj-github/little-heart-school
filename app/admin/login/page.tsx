'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth } from '@/lib/firebase'
import { db } from '@/lib/firebase'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // ✅ Redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return

      const adminSnap = await getDoc(doc(db, 'admins', user.uid))
      if (adminSnap.exists() && adminSnap.data().isActive) {
        router.push('/admin/dashboard')
      } else {
        await auth.signOut()
      }
    })

    return () => unsubscribe()
  }, [router])

  // ===============================
  // EMAIL / PASSWORD LOGIN
  // ===============================
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const emailToUse = email.includes('@')
        ? email
        : `${email}@littleheartschool.com`

      const credential = await signInWithEmailAndPassword(
        auth,
        emailToUse,
        password
      )

      const adminSnap = await getDoc(
        doc(db, 'admins', credential.user.uid)
      )

      if (!adminSnap.exists() || !adminSnap.data().isActive) {
        await auth.signOut()
        setError('You are not authorized as admin')
        return
      }

      // ✅ Redirect handled by auth listener
    } catch (err: any) {
      const messages: Record<string, string> = {
        'auth/invalid-credential': 'Invalid email or password',
        'auth/user-not-found': 'Admin account not found',
        'auth/wrong-password': 'Incorrect password',
        'auth/too-many-requests': 'Too many attempts. Try again later.',
        'auth/user-disabled': 'Account disabled',
        'auth/invalid-email': 'Invalid email format',
        'auth/network-request-failed': 'Network error',
        'auth/operation-not-allowed': 'Email/password login not enabled',
      }

      setError(messages[err.code] || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  // ===============================
  // GOOGLE LOGIN
  // ===============================
  const handleGoogleLogin = async () => {
    setError('')
    setIsLoading(true)

    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: 'select_account' })

      const result = await signInWithPopup(auth, provider)

      const adminSnap = await getDoc(
        doc(db, 'admins', result.user.uid)
      )

      if (!adminSnap.exists() || !adminSnap.data().isActive) {
        await auth.signOut()
        setError('You are not authorized as admin')
        return
      }

      // ✅ Redirect handled by auth listener
    } catch (err: any) {
      const messages: Record<string, string> = {
        'auth/popup-closed-by-user': 'Sign-in cancelled',
        'auth/popup-blocked': 'Popup blocked by browser',
        'auth/unauthorized-domain': 'Domain not authorized',
        'auth/operation-not-allowed': 'Google login not enabled',
      }

      setError(messages[err.code] || 'Google sign-in failed')
    } finally {
      setIsLoading(false)
    }
  }

  // ===============================
  // UI
  // ===============================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Admin Login
          </h1>
          <p className="text-sm text-gray-600">
            Authorized administrators only
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email or Username
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="admin or admin@littleheartschool.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">OR</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex justify-center items-center gap-3 border py-2 rounded hover:bg-gray-50 disabled:opacity-50"
        >
          <span>Sign in with Google</span>
        </button>

        <div className="text-xs text-gray-500 bg-gray-100 p-3 rounded">
          Admin accounts must be pre-approved in Firebase.
        </div>
      </div>
    </div>
  )
}
