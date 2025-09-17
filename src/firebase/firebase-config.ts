import {
  initializeAnalytics,
  isSupported,
  Analytics,
} from 'firebase/analytics';
import { initializeApp, FirebaseApp } from 'firebase/app';

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FB_MEASUREMENT_ID,
};

let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;

// Initialize Firebase app and analytics
export const initializeFirebase = () => {
  if (typeof window !== 'undefined' && !app) {
    app = initializeApp(firebaseConfig);

    if (process.env.NODE_ENV === 'production') {
      isSupported().then((yes) => {
        if (yes && app) {
          analytics = initializeAnalytics(app);
        }
      });
    }
  }
  return { app, analytics };
};

// Get Firebase app instance
export const getFirebaseApp = () => {
  if (!app) {
    initializeFirebase();
  }
  return app;
};

// Get analytics instance
export const getFirebaseAnalytics = () => {
  if (!analytics && typeof window !== 'undefined') {
    initializeFirebase();
  }
  return analytics;
};

// Initialize on module load in production
if (process.env.NODE_ENV === 'production') {
  initializeFirebase();
}
