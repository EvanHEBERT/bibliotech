import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Votre configuration Firebase (remplacez par vos propres clés)
const firebaseConfig = {
  apiKey: "AIzaSyAh7r0X_arTuQj0mA-9xkJf9lryPtp4GZQ",
  authDomain: "bibliotech-bd07b.firebaseapp.com",
  projectId: "bibliotech-bd07b",
  storageBucket: "bibliotech-bd07b.firebasestorage.app",
  messagingSenderId: "543967791494",
  appId: "1:543967791494:web:9be2d694e3ff35d8720407",
  measurementId: "G-446N7TNSWB"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Obtenir une instance de Firestore
const db = getFirestore(app);

export { db };