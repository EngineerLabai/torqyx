import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { FirebaseStorage } from "firebase/storage";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export type FirebaseServices = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  googleProvider: GoogleAuthProvider;
  storage: FirebaseStorage;
};

const normalizeEnv = (value?: string) => {
  if (!value) return value;
  return value.replace(/^"+|"+$/g, "");
};

const firebaseEnv = {
  apiKey: normalizeEnv(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: normalizeEnv(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: normalizeEnv(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  storageBucket: normalizeEnv(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: normalizeEnv(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
  appId: normalizeEnv(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
  measurementId: normalizeEnv(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID),
};

const ENV_KEY_BY_CONFIG = {
  apiKey: "NEXT_PUBLIC_FIREBASE_API_KEY",
  authDomain: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  projectId: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  storageBucket: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  appId: "NEXT_PUBLIC_FIREBASE_APP_ID",
  measurementId: "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID",
} as const;

const firebaseConfig = {
  apiKey: firebaseEnv.apiKey,
  authDomain: firebaseEnv.authDomain,
  projectId: firebaseEnv.projectId,
  storageBucket: firebaseEnv.storageBucket,
  messagingSenderId: firebaseEnv.messagingSenderId,
  appId: firebaseEnv.appId,
  measurementId: firebaseEnv.measurementId,
};

let cached: FirebaseServices | null = null;
let initError: Error | null = null;

const getMissingConfig = () =>
  Object.entries(firebaseEnv)
    .filter(([key, value]) => key !== "measurementId" && !value)
    .map(([key]) => ENV_KEY_BY_CONFIG[key as keyof typeof ENV_KEY_BY_CONFIG]);

export const getFirebaseServices = (): FirebaseServices | null => {
  if (cached || initError) return cached;

  if (typeof window === "undefined") {
    return null;
  }

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
      storage: getStorage(app),
    };
    return cached;
  } catch (error) {
    initError = error instanceof Error ? error : new Error("Firebase initialization failed.");
    return null;
  }
};

export const getFirebaseInitError = () => initError;
