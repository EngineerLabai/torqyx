"use client";

import { useEffect, useState } from "react";
import type { Firestore } from "firebase/firestore";
import type { FirebaseStorage } from "firebase/storage";
import {
  getFirebaseCoreServicesAsync,
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
    let cancelled = false;

    const loadServices = async () => {
      const core = await getFirebaseCoreServicesAsync();
      if (cancelled) return;

      if (!core) {
        const initError = getFirebaseInitError();
        if (initError) {
          setError(initError.message);
        }
        setReady(true);
        return;
      }

      try {
        const [firestore, storage] = await Promise.all([
          getFirebaseFirestoreService(),
          getFirebaseStorageService(),
        ]);
        if (cancelled) return;
        setServices({
          ...core,
          firestore,
          storage,
        });
        setError(null);
        setReady(true);
      } catch (nextError) {
        if (cancelled) return;
        setServices({
          ...core,
          firestore: null,
          storage: null,
        });
        setError(nextError instanceof Error ? nextError.message : "Firebase services unavailable.");
        setReady(true);
      }
    };

    void loadServices();

    return () => {
      cancelled = true;
    };
  }, []);

  return { services, error, ready };
}
