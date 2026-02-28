import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// 🔧 Replace with your actual Firebase Project keys
const firebaseConfig = {
      apiKey: "AIzaSyCWEMwRhmkSZ7GARQVuby0hIDMXLasItGE",
  authDomain: "factoryintelli.firebaseapp.com",
  projectId: "factoryintelli",
  storageBucket: "factoryintelli.firebasestorage.app",
  messagingSenderId: "343300625257",
  appId: "1:343300625257:web:c3c1ec5972db691fb423f8",
  measurementId: "G-LCMQCSN51M"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);