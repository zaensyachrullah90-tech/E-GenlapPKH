// src/utils/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Konfigurasi Asli Anda (Realtime Database)
const firebaseConfig = {
  apiKey: "AIzaSyAv4ZXRI7Q7es3V3pBi_ZZce0fHvgFEKX4",
  authDomain: "e-genlapv11.firebaseapp.com",
  databaseURL: "https://e-genlapv11-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "e-genlapv11",
  storageBucket: "e-genlapv11.firebasestorage.app",
  messagingSenderId: "209352282637",
  appId: "1:209352282637:web:11ddcd9ae57357e7c87b44"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app); // Menggunakan RTDB (Bukan Firestore)