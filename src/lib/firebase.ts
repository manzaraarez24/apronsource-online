import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDi2Lpoitnneq-W38_KYRxwjaKFE22kLwg",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "zarrks.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "zarrks",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "zarrks.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "96301860805",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:96301860805:web:bcd55b47f03529f9c8edac",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
