import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getFunctions } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-functions.js";

const firebaseConfig = {
  apiKey: "AIzaSyDtXC-AO6WA9Lkyx7hx48z4OeEBgLyZZDc",
  authDomain: "datafacil-news.firebaseapp.com",
  projectId: "datafacil-news",
  storageBucket: "datafacil-news.firebasestorage.app",
  messagingSenderId: "169410410673",
  appId: "1:169410410673:web:98891144b9ec6697b54a90",
  measurementId: "G-3T8CTV7P1D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

export { auth, db, functions };
