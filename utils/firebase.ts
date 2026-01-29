import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

type FirebaseServices = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  googleProvider: GoogleAuthProvider;
};

let cached: FirebaseServices | null = null;
let initError: Error | null = null;

const getMissingConfig = () =>
  Object.entries(firebaseConfig)
    .filter(([key, value]) => key !== "measurementId" && !value)
    .map(([key]) => `NEXT_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, "_$1").toUpperCase()}`);

export const getFirebaseServices = (): FirebaseServices | null => {
  if (cached || initError) return cached;

  const missing = getMissingConfig();
  if (missing.length > 0) {
    initError = new Error(`Missing Firebase config. Please set: ${missing.join(", ")}`);
    return null;
  }

  try {
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    cached = {
      app,
      auth: getAuth(app),
      firestore: getFirestore(app),
      googleProvider: new GoogleAuthProvider(),
    };
    return cached;
  } catch (error) {
    initError =
      error instanceof Error ? error : new Error("Firebase initialization failed.");
    return null;
  }
};

export const getFirebaseInitError = () => initError;
