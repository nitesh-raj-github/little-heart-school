import {
  collection,
  getDocs,
  query,
  where,
  orderBy
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface SliderImageDoc {
  id: string
  url: string
  title: string
  subtitle?: string
  order: number
}

export const getSliderImages = async (): Promise<SliderImageDoc[]> => {
  const q = query(
    collection(db, 'slider'),
    where('isActive', '==', true),
    orderBy('order', 'asc')
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(doc => {
    const data = doc.data()
    return {
      id: doc.id,
      url: data.url,
      title: data.title,
      subtitle: data.subtitle || '',
      order: data.order
    }
  })
}
