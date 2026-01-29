"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { getFirebaseServices, getFirebaseInitError } from "@/utils/firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const services = getFirebaseServices();
    if (!services) {
      const error = getFirebaseInitError();
      if (error) {
        console.warn("[auth] Firebase init error:", error.message);
      }
      setLoading(false);
      return;
    }

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
          setLoading(false);
        },
      );
      return () => unsub();
    } catch (error) {
      console.error("[auth] Failed to attach auth listener:", error);
      setUser(null);
      setLoading(false);
      return;
    }
  }, []);

  const loginWithGoogle = async () => {
    const services = getFirebaseServices();
    if (!services) {
      const error = getFirebaseInitError();
      if (error) {
        console.warn("[auth] Firebase init error:", error.message);
      }
      return;
    }
    try {
      await signInWithPopup(services.auth, services.googleProvider);
    } catch (error) {
      console.error("[auth] Google sign-in failed:", error);
    }
  };

  const logout = async () => {
    const services = getFirebaseServices();
    if (!services) return;
    try {
      await signOut(services.auth);
    } catch (error) {
      console.error("[auth] Sign out failed:", error);
    }
  };

  return <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
