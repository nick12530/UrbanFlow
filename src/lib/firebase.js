import { getApps, initializeApp, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
};

// Initialize app only when required env vars are present to avoid runtime crashes
const requiredKeys = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID',
];

const hasAllConfig = requiredKeys.every((key) => Boolean(import.meta.env[key]));

let app = null;
if (getApps().length) {
  app = getApp();
} else if (hasAllConfig) {
  app = initializeApp(firebaseConfig);
} else {
  // eslint-disable-next-line no-console
  console.warn('[Firebase] Missing configuration. Auth features are disabled.');
}

export const auth = app ? getAuth(app) : null;
export const googleProvider = new GoogleAuthProvider();
export default app;


