import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { FirebaseStorage } from "firebase/storage";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

export type FirebaseCoreServices = {
  app: FirebaseApp;
  auth: Auth;
  googleProvider: GoogleAuthProvider;
};

const normalizeEnv = (value?: string) => {
  if (!value) return undefined;

  let normalized = value.trim();
  while (
    normalized.length >= 2 &&
    ((normalized.startsWith("\"") && normalized.endsWith("\"")) ||
      (normalized.startsWith("'") && normalized.endsWith("'")))
  ) {
    normalized = normalized.slice(1, -1).trim();
  }

  if (!normalized) return undefined;

  const lowered = normalized.toLowerCase();
  if (lowered === "undefined" || lowered === "null") {
    return undefined;
  }

  return normalized;
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

let cachedCore: FirebaseCoreServices | null = null;
let cachedFirestore: Firestore | null | undefined;
let cachedStorage: FirebaseStorage | null | undefined;
let firestorePromise: Promise<Firestore | null> | null = null;
let storagePromise: Promise<FirebaseStorage | null> | null = null;
let initError: Error | null = null;

const reportInitError = (error: Error) => {
  if (!initError) {
    console.error("[firebase] Client init failed:", error.message);
  }
  initError = error;
};

const getMissingConfig = () =>
  Object.entries(firebaseEnv)
    .filter(([key, value]) => key !== "measurementId" && !value)
    .map(([key]) => ENV_KEY_BY_CONFIG[key as keyof typeof ENV_KEY_BY_CONFIG]);

export const getFirebaseCoreServices = (): FirebaseCoreServices | null => {
  if (cachedCore || initError) return cachedCore;

  if (typeof window === "undefined") {
    return null;
  }

  const missing = getMissingConfig();
  if (missing.length > 0) {
    reportInitError(new Error(`Missing Firebase config. Please set: ${missing.join(", ")}`));
    return null;
  }

  try {
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    cachedCore = {
      app,
      auth: getAuth(app),
      googleProvider: new GoogleAuthProvider(),
    };
    return cachedCore;
  } catch (error) {
    reportInitError(error instanceof Error ? error : new Error("Firebase initialization failed."));
    return null;
  }
};

export const getFirebaseFirestoreService = async (): Promise<Firestore | null> => {
  if (cachedFirestore !== undefined) return cachedFirestore;
  if (firestorePromise) return firestorePromise;

  const core = getFirebaseCoreServices();
  if (!core) {
    cachedFirestore = null;
    return null;
  }

  firestorePromise = import("firebase/firestore")
    .then(({ getFirestore }) => {
      cachedFirestore = getFirestore(core.app);
      return cachedFirestore;
    })
    .catch((error) => {
      reportInitError(error instanceof Error ? error : new Error("Firestore initialization failed."));
      cachedFirestore = null;
      return null;
    })
    .finally(() => {
      firestorePromise = null;
    });

  return firestorePromise;
};

export const getFirebaseStorageService = async (): Promise<FirebaseStorage | null> => {
  if (cachedStorage !== undefined) return cachedStorage;
  if (storagePromise) return storagePromise;

  const core = getFirebaseCoreServices();
  if (!core) {
    cachedStorage = null;
    return null;
  }

  storagePromise = import("firebase/storage")
    .then(({ getStorage }) => {
      cachedStorage = getStorage(core.app);
      return cachedStorage;
    })
    .catch((error) => {
      reportInitError(error instanceof Error ? error : new Error("Storage initialization failed."));
      cachedStorage = null;
      return null;
    })
    .finally(() => {
      storagePromise = null;
    });

  return storagePromise;
};

export const getFirebaseInitError = () => initError;
