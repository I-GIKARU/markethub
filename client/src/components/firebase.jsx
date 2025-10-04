// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCd4cQhAtgCeg42f4L_Hy45ToyDD6jNzXk",
  authDomain: "login-569df.firebaseapp.com",
  projectId: "login-569df",
  storageBucket: "login-569df.appspot.com",
  messagingSenderId: "379064402946",
  appId: "1:379064402946:web:0d267ad69f7dcd40b2531b",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
