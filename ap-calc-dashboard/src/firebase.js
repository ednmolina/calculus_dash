
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";

// PASTE YOUR FIREBASE CONFIG FROM THE CONSOLE HERE
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Syncs the dashboard state to a specific student document in Firestore.
 */
export const syncToFirebase = async (studentId, data) => {
  if (!studentId) return;
  const docRef = doc(db, "students", studentId);
  await setDoc(docRef, data, { merge: true });
};

/**
 * Listens for real-time updates for a specific student.
 */
export const subscribeToStudent = (studentId, callback) => {
  if (!studentId) return;
  const docRef = doc(db, "students", studentId);
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    }
  });
};

export { db };
