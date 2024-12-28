// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMupMRKiLPePq33JrsNjrDaGFa2qu_ic4",
  authDomain: "slack-clone-4f4ae.firebaseapp.com",
  projectId: "slack-clone-4f4ae",
  storageBucket: "slack-clone-4f4ae.firebasestorage.app",
  messagingSenderId: "311174705893",
  appId: "1:311174705893:web:b0ff45ce56c289ec7f1a0c"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export { firebaseApp };