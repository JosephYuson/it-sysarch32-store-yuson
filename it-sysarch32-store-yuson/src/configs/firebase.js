// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBnEnL71wtSuZwxDF2y2ws1RX4BNAxvfgc",
  authDomain: "it-sysarch32-store-yuson.firebaseapp.com",
  projectId: "it-sysarch32-store-yuson",
  storageBucket: "it-sysarch32-store-yuson.appspot.com",
  messagingSenderId: "1076456843504",
  appId: "1:1076456843504:web:e740df3cc5e80849b17a35",
  measurementId: "G-YWPFKXMWGG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);

export const storage = getStorage(app);
const analytics = getAnalytics(app);