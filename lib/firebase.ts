import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";

type FirebasePublicConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
  storageBucket?: string;
  messagingSenderId?: string;
};

const firebasePublicConfig: FirebasePublicConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || undefined,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || undefined
};

export function hasFirebaseConfig() {
  return Boolean(
    firebasePublicConfig.apiKey.trim() &&
      firebasePublicConfig.authDomain.trim() &&
      firebasePublicConfig.projectId.trim() &&
      firebasePublicConfig.appId.trim()
  );
}

function getFirebaseConfig(): FirebasePublicConfig {
  if (!hasFirebaseConfig()) {
    throw new Error(
      "Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, NEXT_PUBLIC_FIREBASE_PROJECT_ID, and NEXT_PUBLIC_FIREBASE_APP_ID, or keep using local demo mode."
    );
  }

  return firebasePublicConfig;
}

export function getFirebaseApp(): FirebaseApp {
  const existingApp = getApps()[0];
  if (existingApp) return existingApp;
  return initializeApp(getFirebaseConfig());
}

export async function getClientAuth(): Promise<Auth> {
  const { getAuth } = await import("firebase/auth");
  return getAuth(getFirebaseApp());
}

export async function getClientDb(): Promise<Firestore> {
  const { getFirestore } = await import("firebase/firestore");
  return getFirestore(getFirebaseApp());
}
