
import { initializeApp } from "firebase/app";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCjYUN2U999q4B_1_7DMCB6gfzKnNfcT88",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "shelter-seeker.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "shelter-seeker",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "shelter-seeker.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "834371567114",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:834371567114:web:ef1fa7ab11b9a2c190e9f3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the app for use in other components
export { app };