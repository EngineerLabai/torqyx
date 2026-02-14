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
const AUTH_INIT_TIMEOUT_MS = 8000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [available, setAvailable] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let initialResolved = false;

    const resolveInitial = () => {
      if (initialResolved) return;
      initialResolved = true;
      setLoading(false);
    };

    const initTimeout = window.setTimeout(() => {
      if (!active || initialResolved) return;
      initialResolved = true;
      console.error(`[auth] Initialization timed out after ${AUTH_INIT_TIMEOUT_MS}ms.`);
      setUser(null);
      setError("Auth initialization timed out.");
      setAvailable(false);
      setLoading(false);
    }, AUTH_INIT_TIMEOUT_MS);

    const services = getFirebaseServices();
    if (!services) {
      const initError = getFirebaseInitError();
      Promise.resolve().then(() => {
        if (!active) return;
        if (initError) {
          console.warn("[auth] Firebase init error:", initError.message);
          setError(initError.message);
        }
        setAvailable(false);
        resolveInitial();
      });
      return () => {
        active = false;
        window.clearTimeout(initTimeout);
      };
    }

    Promise.resolve().then(() => {
      if (!active) return;
      setAvailable(true);
      setError(null);
    });

    try {
      const unsub = onAuthStateChanged(
        services.auth,
        (nextUser) => {
          if (!active) return;
          setUser(nextUser);
          setAvailable(true);
          setError(null);
          resolveInitial();
        },
        (error) => {
          if (!active) return;
          console.error("[auth] State listener error:", error);
          setUser(null);
          setError(error instanceof Error ? error.message : "Auth listener failed.");
          setAvailable(false);
          resolveInitial();
        },
      );
      return () => {
        active = false;
        window.clearTimeout(initTimeout);
        unsub();
      };
    } catch (error) {
      console.error("[auth] Failed to attach auth listener:", error);
      Promise.resolve().then(() => {
        if (!active) return;
        setUser(null);
        setError(error instanceof Error ? error.message : "Auth listener failed.");
        setAvailable(false);
        resolveInitial();
      });
      return () => {
        active = false;
        window.clearTimeout(initTimeout);
      };
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
