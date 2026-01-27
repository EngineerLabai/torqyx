import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "studio-8613033274-939e6.firebaseapp.com",
  projectId: "studio-8613033274-939e6",
  storageBucket: "studio-8613033274-939e6.firebasestorage.app",
  messagingSenderId: "867144401702",
  appId: "1:867144401702:web:a1b1b7a877068059ddf7e7",
};

const createFirebaseApp = () => {
  if (!firebaseConfig.apiKey) {
    throw new Error("Missing Firebase config. Please set NEXT_PUBLIC_FIREBASE_* env vars.");
  }
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
  return getApp();
};

const app = createFirebaseApp();

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
