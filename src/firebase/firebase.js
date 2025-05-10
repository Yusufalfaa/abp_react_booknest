// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // jika kamu pakai Auth
import { getFirestore } from "firebase/firestore"; // jika pakai Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpjY45F6sequ_uQxJ4vlnoow-2vEa5jlw",
  authDomain: "booknest-firebase.firebaseapp.com",
  projectId: "booknest-firebase",
  storageBucket: "booknest-firebase.firebasestorage.app",
  messagingSenderId: "678465747831",
  appId: "1:678465747831:web:cec6e6cc035e095a5cbf72"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export fitur yang kamu pakai
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
