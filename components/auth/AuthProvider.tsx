"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { getFirebaseServices, getFirebaseInitError } from "@/lib/firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  available: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [available, setAvailable] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const services = getFirebaseServices();
    if (!services) {
      const initError = getFirebaseInitError();
      if (initError) {
        console.warn("[auth] Firebase init error:", initError.message);
        setError(initError.message);
      }
      setAvailable(false);
      setLoading(false);
      return;
    }

    setAvailable(true);
    setError(null);

    try {
      const unsub = onAuthStateChanged(
        services.auth,
        (nextUser) => {
          setUser(nextUser);
          setLoading(false);
        },
        (error) => {
          console.error("[auth] State listener error:", error);
          setUser(null);
          setError(error instanceof Error ? error.message : "Auth listener failed.");
          setAvailable(false);
          setLoading(false);
        },
      );
      return () => unsub();
    } catch (error) {
      console.error("[auth] Failed to attach auth listener:", error);
      setUser(null);
      setError(error instanceof Error ? error.message : "Auth listener failed.");
      setAvailable(false);
      setLoading(false);
      return;
    }
  }, []);

  const loginWithGoogle = async () => {
    const services = getFirebaseServices();
    if (!services) {
      const initError = getFirebaseInitError();
      if (initError) {
        console.warn("[auth] Firebase init error:", initError.message);
        setError(initError.message);
      }
      setAvailable(false);
      return;
    }
    try {
      await signInWithPopup(services.auth, services.googleProvider);
    } catch (error) {
      console.error("[auth] Google sign-in failed:", error);
      setError(error instanceof Error ? error.message : "Google sign-in failed.");
    }
  };

  const logout = async () => {
    const services = getFirebaseServices();
    if (!services) {
      setAvailable(false);
      return;
    }
    try {
      await signOut(services.auth);
    } catch (error) {
      console.error("[auth] Sign out failed:", error);
      setError(error instanceof Error ? error.message : "Sign out failed.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, available, error, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

export function useOptionalAuth() {
  return useContext(AuthContext);
}
