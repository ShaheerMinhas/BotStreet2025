import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth'; // Import the auth module

const firebaseConfig = {
    apiKey: "AIzaSyAEd85sgq3BxXRHo29YTSbkIjMKSDRHrjo",
    authDomain: "audioplayer-33956.firebaseapp.com",
    projectId: "audioplayer-33956",
    storageBucket: "audioplayer-33956.appspot.com",
    messagingSenderId: "447611407634",
    appId: "1:447611407634:web:9e73f534539ca7548b77cb",
    measurementId: "G-JD8MYS3558"
  };

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app); // Initialize the auth object

export { storage, app, db, auth as default }; // Export all services
