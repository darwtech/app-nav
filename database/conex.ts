// database/conex.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAnuHLmO-96-fffy93-_qjkXzcTCrb0cDA",
  authDomain: "app-nav-cc3d5.firebaseapp.com",
  projectId: "app-nav-cc3d5",
  storageBucket: "app-nav-cc3d5.appspot.com",
  messagingSenderId: "80722447318",
  appId: "1:80722447318:web:fb634c7fefbbcb79337277",
  measurementId: "G-PYN34ENGQ5"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
