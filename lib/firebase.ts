import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCGPBOcqnPM6QEYEjeZxUBa5oHDeiJmeGI",
    authDomain: "quiniela-digital-app-v1.firebaseapp.com",
    projectId: "quiniela-digital-app-v1",
    storageBucket: "quiniela-digital-app-v1.firebasestorage.app",
    messagingSenderId: "896801219779",
    appId: "1:896801219779:web:e20204c6dd2c5c40afee76",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
