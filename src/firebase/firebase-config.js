// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYYtsLpZmtTYrCpYm6lCLQIjF55mfzMqk",
  authDomain: "booknest-2c30d.firebaseapp.com",
  projectId: "booknest-2c30d",
  storageBucket: "booknest-2c30d.firebasestorage.app",
  messagingSenderId: "64012221301",
  appId: "1:64012221301:web:8d1da036dfd7b13f37313c",
  measurementId: "G-37DEQFXMGC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);