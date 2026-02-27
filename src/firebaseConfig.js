// Firebase Configuration for NLAC Student Grade Tracker
// This configuration connects to Firebase Firestore for cloud data storage

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

// Firebase configuration - uses the project from .firebaserc
const firebaseConfig = {
  apiKey: "AIzaSyC3T9M61Ryll8scTGVWH5QdZKuAguWTzgw",
  authDomain: "studentgradetracker-e04c0.firebaseapp.com",
  projectId: "studentgradetracker-e04c0",
  storageBucket: "studentgradetracker-e04c0.firebasestorage.app",
  messagingSenderId: "886408200590",
  appId: "1:886408200590:web:c9fbdb028e5dcd442c64df"
};

// Initialize Firebase - only if not already initialized
let app;
let db;

const initializeFirebase = () => {
  try {
    // Check if any apps are already initialized
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    
    // Initialize Firestore
    db = getFirestore(app);
    
    // Enable offline persistence for better mobile experience
    // This allows the app to work offline and sync when back online
    enableIndexedDbPersistence(db)
      .catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('Firestore persistence failed: Multiple tabs open');
        } else if (err.code === 'unimplemented') {
          console.warn('Firestore persistence not available in this browser');
        }
      });
      
    return { app, db };
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return { app: null, db: null };
  }
};

// Initialize immediately
const initialized = initializeFirebase();

export { db, firebaseConfig, initialized };
export default app;

