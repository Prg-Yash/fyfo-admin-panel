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
  apiKey: "AIzaSyDavsVpgLlN86EIBY51om-2n5PESvdEiX0",
  authDomain: "fyfo-5bbd5.firebaseapp.com",
  projectId: "fyfo-5bbd5",
  storageBucket: "fyfo-5bbd5.firebasestorage.app",
  messagingSenderId: "731204638760",
  appId: "1:731204638760:web:0c43dfe1dbd6f9f4b9bd1d",
  measurementId: "G-MH4LGJGXDB",
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
