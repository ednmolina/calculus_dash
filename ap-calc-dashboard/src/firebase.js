import { getApp, getApps, initializeApp } from 'firebase/app'
import { doc, getFirestore, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const requiredFirebaseConfig = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.storageBucket,
  firebaseConfig.messagingSenderId,
  firebaseConfig.appId,
]

export const firebaseEnabled = requiredFirebaseConfig.every(Boolean)

const app = firebaseEnabled ? (getApps().length ? getApp() : initializeApp(firebaseConfig)) : null
const db = app ? getFirestore(app) : null

export async function syncDashboardToFirebase(dashboardId, data) {
  if (!db || !dashboardId) return

  const docRef = doc(db, 'dashboards', dashboardId)
  await setDoc(
    docRef,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export function subscribeToDashboard(dashboardId, callback, onError) {
  if (!db || !dashboardId) return () => {}

  const docRef = doc(db, 'dashboards', dashboardId)
  return onSnapshot(
    docRef,
    (snapshot) => {
      callback(snapshot.exists() ? snapshot.data() : null)
    },
    (error) => {
      if (onError) onError(error)
    },
  )
}
