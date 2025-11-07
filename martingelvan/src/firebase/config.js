import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // si usás autenticación
import { getStorage } from "firebase/storage"; // si usás almacenamiento

const firebaseConfig = {
  apiKey: "AIzaSyBPYl3JUfCASv3srMl3gxZ185z49qm4Zsg",
  authDomain: "martingelvan-d01f2.firebaseapp.com",
  projectId: "martingelvan-d01f2",
  storageBucket: "martingelvan-d01f2.firebasestorage.app",
  messagingSenderId: "817201098570",
  appId: "1:817201098570:web:2c14c91eedc344c9129bb3",
  measurementId: "G-9VFMWK9NJW",
};
// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exportá los servicios que uses
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
