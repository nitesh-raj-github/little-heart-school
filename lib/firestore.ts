// lib/firestore.ts
import { 
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  DocumentData,
  QuerySnapshot,
  QueryDocumentSnapshot
} from 'firebase/firestore'
import { db } from './firebase'

// Collections
export const COLLECTIONS = {
  SLIDER_IMAGES: 'slider_images',
  GALLERY_IMAGES: 'gallery_images',
  FACULTY: 'faculty',
  ADMISSIONS: 'admissions',
  SETTINGS: 'settings',
  CONTACT_SUBMISSIONS: 'contact_submissions',
  USERS: 'users'
}

// Generic CRUD operations
export const createDocument = async (collectionName: string, data: any) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })
    return docRef.id
  } catch (error) {
    console.error('Error creating document:', error)
    throw error
  }
}

export const getDocument = async (collectionName: string, id: string) => {
  try {
    const docRef = doc(db, collectionName, id)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      }
    }
    return null
  } catch (error) {
    console.error('Error getting document:', error)
    throw error
  }
}

export const updateDocument = async (collectionName: string, id: string, data: any) => {
  try {
    const docRef = doc(db, collectionName, id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    })
    return true
  } catch (error) {
    console.error('Error updating document:', error)
    throw error
  }
}

export const deleteDocument = async (collectionName: string, id: string) => {
  try {
    const docRef = doc(db, collectionName, id)
    await deleteDoc(docRef)
    return true
  } catch (error) {
    console.error('Error deleting document:', error)
    throw error
  }
}

export const getDocuments = async (
  collectionName: string,
  filters?: { field: string; operator: any; value: any }[],
  orderByField?: string,
  orderDirection: 'asc' | 'desc' = 'desc',
  pageSize?: number,
  lastDoc?: QueryDocumentSnapshot
) => {
  try {
    let q = query(collection(db, collectionName))
    
    // Apply filters
    if (filters) {
      filters.forEach(filter => {
        q = query(q, where(filter.field, filter.operator, filter.value))
      })
    }
    
    // Apply ordering
    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection))
    }
    
    // Apply pagination
    if (pageSize) {
      q = query(q, limit(pageSize))
      if (lastDoc) {
        q = query(q, startAfter(lastDoc))
      }
    }
    
    const querySnapshot = await getDocs(q)
    const documents: any[] = []
    
    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return {
      documents,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1]
    }
  } catch (error) {
    console.error('Error getting documents:', error)
    throw error
  }
}

// Slider Images
export const sliderImagesAPI = {
  getAll: async () => await getDocuments(COLLECTIONS.SLIDER_IMAGES, [
    { field: 'isActive', operator: '==', value: true }
  ], 'order', 'asc'),
  
  create: async (data: any) => await createDocument(COLLECTIONS.SLIDER_IMAGES, data),
  
  update: async (id: string, data: any) => await updateDocument(COLLECTIONS.SLIDER_IMAGES, id, data),
  
  delete: async (id: string) => await deleteDocument(COLLECTIONS.SLIDER_IMAGES, id)
}

// Gallery Images
export const galleryImagesAPI = {
 getAll: async (category?: string) => {
  const filters: { field: string; operator: any; value: any }[] = [
    { field: 'isActive', operator: '==', value: true }
  ]

  if (category && category !== 'All') {
    filters.push({ field: 'category', operator: '==', value: category })
  }

  return await getDocuments(
    COLLECTIONS.GALLERY_IMAGES,
    filters,
    'date',
    'desc'
  )
},
  
  create: async (data: any) => await createDocument(COLLECTIONS.GALLERY_IMAGES, data),
  
  update: async (id: string, data: any) => await updateDocument(COLLECTIONS.GALLERY_IMAGES, id, data),
  
  delete: async (id: string) => await deleteDocument(COLLECTIONS.GALLERY_IMAGES, id)
}

// Faculty
export const facultyAPI = {
  getAll: async (department?: string) => {
  const filters: { field: string; operator: any; value: any }[] = [
    { field: 'isActive', operator: '==', value: true }
  ]

  if (department && department !== 'All') {
    filters.push({ field: 'department', operator: '==', value: department })
  }

  return await getDocuments(
    COLLECTIONS.FACULTY,
    filters,
    'order',
    'asc'
  )
},

  create: async (data: any) => await createDocument(COLLECTIONS.FACULTY, data),
  
  update: async (id: string, data: any) => await updateDocument(COLLECTIONS.FACULTY, id, data),
  
  delete: async (id: string) => await deleteDocument(COLLECTIONS.FACULTY, id)
}

// Admissions
export const admissionsAPI = {
  getAll: async (status?: string) => {
    const filters = []
    if (status && status !== 'All') {
      filters.push({ field: 'status', operator: '==', value: status })
    }
    return await getDocuments(COLLECTIONS.ADMISSIONS, filters, 'appliedDate', 'desc')
  },
  
  create: async (data: any) => await createDocument(COLLECTIONS.ADMISSIONS, data),
  
  update: async (id: string, data: any) => await updateDocument(COLLECTIONS.ADMISSIONS, id, data),
  
  delete: async (id: string) => await deleteDocument(COLLECTIONS.ADMISSIONS, id),
  
  getStats: async () => {
    const [pending, approved, rejected, waitlisted] = await Promise.all([
      getDocuments(COLLECTIONS.ADMISSIONS, [{ field: 'status', operator: '==', value: 'pending' }]),
      getDocuments(COLLECTIONS.ADMISSIONS, [{ field: 'status', operator: '==', value: 'approved' }]),
      getDocuments(COLLECTIONS.ADMISSIONS, [{ field: 'status', operator: '==', value: 'rejected' }]),
      getDocuments(COLLECTIONS.ADMISSIONS, [{ field: 'status', operator: '==', value: 'waitlisted' }])
    ])
    
    return {
      total: (await getDocuments(COLLECTIONS.ADMISSIONS)).documents.length,
      pending: pending.documents.length,
      approved: approved.documents.length,
      rejected: rejected.documents.length,
      waitlisted: waitlisted.documents.length
    }
  }
}

// Contact Submissions
export const contactAPI = {
  create: async (data: any) => await createDocument(COLLECTIONS.CONTACT_SUBMISSIONS, data),
  
  getAll: async () => await getDocuments(COLLECTIONS.CONTACT_SUBMISSIONS, [], 'createdAt', 'desc')
}

// Settings
// Settings
export const settingsAPI = {
  get: async (key: string) => {
    const doc = await getDocument(COLLECTIONS.SETTINGS, key)
  },
  
  set: async (key: string, value: any) => {
    const existing = await getDocument(COLLECTIONS.SETTINGS, key)
    if (existing) {
      return await updateDocument(COLLECTIONS.SETTINGS, key, { 
        data: { value },
        updatedAt: Timestamp.now()
      })
    } else {
      return await createDocument(COLLECTIONS.SETTINGS, { 
        key,
        data: { value },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      })
    }
  }
}