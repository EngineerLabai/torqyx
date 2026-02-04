import "server-only";

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

type ServiceAccount = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

let cachedDb: Firestore | null = null;
let initError: Error | null = null;

const normalizePrivateKey = (value: string) => value.replace(/\\n/g, "\n");

const getServiceAccountFromEnv = (): ServiceAccount | null => {
  const rawJson = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT ?? process.env.FIREBASE_SERVICE_ACCOUNT;
  if (rawJson) {
    try {
      const parsed = JSON.parse(rawJson) as {
        project_id?: string;
        client_email?: string;
        private_key?: string;
      };
      if (parsed.project_id && parsed.client_email && parsed.private_key) {
        return {
          projectId: parsed.project_id,
          clientEmail: parsed.client_email,
          privateKey: normalizePrivateKey(parsed.private_key),
        };
      }
    } catch (error) {
      initError = error instanceof Error ? error : new Error("Invalid Firebase service account JSON.");
      return null;
    }
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return {
    projectId,
    clientEmail,
    privateKey: normalizePrivateKey(privateKey),
  };
};

export const getAdminFirestore = () => {
  if (cachedDb) return cachedDb;
  if (initError) throw initError;

  const serviceAccount = getServiceAccountFromEnv();
  if (!serviceAccount) {
    if (initError) {
      throw initError;
    }
    initError = new Error("Missing Firebase admin credentials.");
    throw initError;
  }

  const app = getApps().length
    ? getApps()[0]
    : initializeApp({
        credential: cert({
          projectId: serviceAccount.projectId,
          clientEmail: serviceAccount.clientEmail,
          privateKey: serviceAccount.privateKey,
        }),
        projectId: serviceAccount.projectId,
      });

  cachedDb = getFirestore(app);
  return cachedDb;
};
