// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBzYESqyrFq5x5WvINkKa_FqkLvOAA6spk",
  authDomain: "recommendation-system-62a42.firebaseapp.com",
  databaseURL:
    "https://recommendation-system-62a42-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "recommendation-system-62a42",
  storageBucket: "recommendation-system-62a42.appspot.com",
  messagingSenderId: "618231349247",
  appId: "1:618231349247:web:13c4111cdab136c0f1f1ca",
  measurementId: "G-EM4P1Z169L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

// Ensure storage folders exist (this doesn't actually create folders, just references)
const imagesRef = ref(storage, "images");
const videosRef = ref(storage, "videos");

export { app, auth, storage };
