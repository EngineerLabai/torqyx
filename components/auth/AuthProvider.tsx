"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Unsubscribe, User } from "firebase/auth";
import { usePathname } from "next/navigation";
import { getFirebaseCoreServicesAsync, getFirebaseInitError } from "@/lib/firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  available: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const PUBLIC_AUTH_INIT_DELAY_MS = 30000;

const shouldInitAuthImmediately = (pathname: string | null) =>
  Boolean(pathname && /^\/(?:[a-z]{2}\/)?(?:dashboard|login|saved-calculations)(?:\/|$)/.test(pathname));

const scheduleAuthInit = (callback: () => void, delayMs: number) => {
  const timeoutId = window.setTimeout(callback, delayMs);
  return () => window.clearTimeout(timeoutId);
};

const getErrorCode = (error: unknown) => {
  if (error && typeof error === "object" && "code" in error && typeof error.code === "string") {
    return error.code;
  }
  return null;
};

const getErrorMessage = (error: unknown, fallback: string) => (error instanceof Error ? error.message : fallback);

const getLoginErrorMessage = (error: unknown) => {
  const code = getErrorCode(error);

  if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
    return null;
  }

  if (code === "auth/popup-blocked") {
    return "Sign-in popup was blocked by the browser.";
  }

  if (code === "auth/configuration-not-found") {
    return "Firebase Authentication is not enabled for this project yet.";
  }

  if (code === "auth/unauthorized-domain") {
    return "This domain is not authorized in Firebase Authentication.";
  }

  return getErrorMessage(error, "Google sign-in failed.");
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const authStartedRef = useRef(false);
  const mountedRef = useRef(false);
  const unsubscribeRef = useRef<Unsubscribe | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading] = useState(false);
  const [available, setAvailable] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      unsubscribeRef.current?.();
      unsubscribeRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (authStartedRef.current) return;

    const initAuth = async () => {
      if (authStartedRef.current) return;
      authStartedRef.current = true;

      const services = await getFirebaseCoreServicesAsync();
      if (!mountedRef.current) return;

      if (!services) {
        const initError = getFirebaseInitError();
        if (!mountedRef.current) return;
        if (initError) {
          setError(initError.message);
        }
        setAvailable(false);
        return;
      }

      setAvailable(true);
      setError(null);

      try {
        const { onAuthStateChanged } = await import("firebase/auth");
        if (!mountedRef.current) return;
        unsubscribeRef.current = onAuthStateChanged(
          services.auth,
          (nextUser) => {
            if (!mountedRef.current) return;
            setUser(nextUser);
            setAvailable(true);
            setError(null);
          },
          (error) => {
            if (!mountedRef.current) return;
            console.error("[auth] State listener error:", error);
            setUser(null);
            setError(error instanceof Error ? error.message : "Auth listener failed.");
            setAvailable(false);
          },
        );
      } catch (error) {
        console.error("[auth] Failed to attach auth listener:", error);
        if (!mountedRef.current) return;
        setUser(null);
        setError(error instanceof Error ? error.message : "Auth listener failed.");
        setAvailable(false);
      };
    };

    const cancelAuthInit = scheduleAuthInit(() => {
      void initAuth();
    }, shouldInitAuthImmediately(pathname) ? 0 : PUBLIC_AUTH_INIT_DELAY_MS);

    return () => {
      cancelAuthInit();
    };
  }, [pathname]);

  const loginWithGoogle = useCallback(async () => {
    const services = await getFirebaseCoreServicesAsync();
    if (!services) {
      const initError = getFirebaseInitError();
      if (initError) {
        setError(initError.message);
      }
      setAvailable(false);
      return;
    }
    try {
      setError(null);
      const { signInWithPopup } = await import("firebase/auth");
      await signInWithPopup(services.auth, services.googleProvider);
    } catch (error) {
      const message = getLoginErrorMessage(error);
      if (!message) return;
      console.error("[auth] Google sign-in failed:", error);
      setError(message);
    }
  }, []);

  const logout = useCallback(async () => {
    const services = await getFirebaseCoreServicesAsync();
    if (!services) {
      setAvailable(false);
      return;
    }
    try {
      const { signOut } = await import("firebase/auth");
      await signOut(services.auth);
    } catch (error) {
      console.error("[auth] Sign out failed:", error);
      setError(error instanceof Error ? error.message : "Sign out failed.");
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      available,
      error,
      loginWithGoogle,
      logout,
      clearError,
    }),
    [user, loading, available, error, loginWithGoogle, logout, clearError],
  );

  return (
    <AuthContext.Provider value={value}>
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
