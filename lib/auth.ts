// lib/auth.ts
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth } from './firebase'
import { db } from './firebase'
import toast from 'react-hot-toast'

// ==============================
// Types
// ==============================
export type UserRole = 'admin'

export interface AppUser {
  uid: string
  email: string
  displayName: string
  role: UserRole
}

// ==============================
// Helpers
// ==============================
const isUserAdmin = async (uid: string): Promise<boolean> => {
  const snap = await getDoc(doc(db, 'admins', uid))
  return snap.exists() && snap.data().isActive === true
}

// ==============================
// Email / Password Login
// ==============================
export const loginWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    const credential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )

    const allowed = await isUserAdmin(credential.user.uid)
    if (!allowed) {
      await signOut(auth)
      throw new Error('NOT_ADMIN')
    }

    toast.success('Login successful')
    return credential
  } catch (error: any) {
    toast.error(getAuthErrorMessage(error.code || error.message))
    throw error
  }
}

// ==============================
// Google Login
// ==============================
export const loginWithGoogle = async (): Promise<UserCredential> => {
  try {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })

    const credential = await signInWithPopup(auth, provider)

    const allowed = await isUserAdmin(credential.user.uid)
    if (!allowed) {
      await signOut(auth)
      throw new Error('NOT_ADMIN')
    }

    toast.success('Login successful')
    return credential
  } catch (error: any) {
    toast.error(getAuthErrorMessage(error.code || error.message))
    throw error
  }
}

// ==============================
// Logout
// ==============================
export const logout = async () => {
  await signOut(auth)
  toast.success('Logged out')
}

// ==============================
// Auth State Listener
// ==============================
export const onAdminAuthStateChange = (
  callback: (user: AppUser | null) => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (!user) {
      callback(null)
      return
    }

    const allowed = await isUserAdmin(user.uid)
    if (!allowed) {
      await signOut(auth)
      callback(null)
      return
    }

    callback({
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      role: 'admin',
    })
  })
}

// ==============================
// Get Current Admin
// ==============================
export const getCurrentAdmin = async (): Promise<AppUser | null> => {
  const user = auth.currentUser
  if (!user) return null

  const allowed = await isUserAdmin(user.uid)
  if (!allowed) {
    await signOut(auth)
    return null
  }

  return {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || '',
    role: 'admin',
  }
}

// ==============================
// Error Messages
// ==============================
const getAuthErrorMessage = (code: string): string => {
  const map: Record<string, string> = {
    'auth/invalid-email': 'Invalid email address',
    'auth/user-disabled': 'Account disabled',
    'auth/user-not-found': 'Admin account not found',
    'auth/wrong-password': 'Incorrect password',
    'auth/too-many-requests': 'Too many attempts. Try again later',
    'auth/network-request-failed': 'Network error',
    'NOT_ADMIN': 'You are not authorized as admin',
  }

  return map[code] || 'Authentication failed'
}
