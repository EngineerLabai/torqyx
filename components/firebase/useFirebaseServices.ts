"use client";

import { useEffect, useState } from "react";
import { getFirebaseInitError, getFirebaseServices, type FirebaseServices } from "@/lib/firebase";

export default function useFirebaseServices() {
  const [services, setServices] = useState<FirebaseServices | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const next = getFirebaseServices();
    if (!next) {
      const initError = getFirebaseInitError();
      if (initError) {
        setError(initError.message);
      }
      setReady(true);
      return;
    }

    setServices(next);
    setError(null);
    setReady(true);
  }, []);

  return { services, error, ready };
}
