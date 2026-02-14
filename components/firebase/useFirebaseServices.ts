"use client";

import { useEffect, useState } from "react";
import type { Firestore } from "firebase/firestore";
import type { FirebaseStorage } from "firebase/storage";
import {
  getFirebaseCoreServices,
  getFirebaseFirestoreService,
  getFirebaseInitError,
  getFirebaseStorageService,
  type FirebaseCoreServices,
} from "@/lib/firebase";

type FirebaseServices = FirebaseCoreServices & {
  firestore: Firestore | null;
  storage: FirebaseStorage | null;
};

export default function useFirebaseServices() {
  const [services, setServices] = useState<FirebaseServices | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const core = getFirebaseCoreServices();
    if (!core) {
      const initError = getFirebaseInitError();
      Promise.resolve().then(() => {
        if (initError) {
          setError(initError.message);
        }
        setReady(true);
      });
      return;
    }

    let cancelled = false;

    Promise.all([getFirebaseFirestoreService(), getFirebaseStorageService()])
      .then(([firestore, storage]) => {
        if (cancelled) return;
        setServices({
          ...core,
          firestore,
          storage,
        });
        setError(null);
        setReady(true);
      })
      .catch((nextError) => {
        if (cancelled) return;
        setServices({
          ...core,
          firestore: null,
          storage: null,
        });
        setError(nextError instanceof Error ? nextError.message : "Firebase services unavailable.");
        setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { services, error, ready };
}
