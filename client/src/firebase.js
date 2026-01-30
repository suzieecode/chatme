// firebase.js

// Import functions from Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase configuration (from Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyBO5MyEHYcb9NRlzAGzIQVIBpbgyn1sMLA",
  authDomain: "chat-aeed3.firebaseapp.com",
  projectId: "chat-aeed3",
  storageBucket: "chat-aeed3.firebasestorage.app",
  messagingSenderId: "1013487331456",
  appId: "1:1013487331456:web:16206d75d393747238de65"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);