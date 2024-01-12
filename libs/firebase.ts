
import { initializeApp } from "firebase/app";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyzbcFkIyV548uwRlUjssBqmz6AYQN6zo",
  authDomain: "gm-store-4f56b.firebaseapp.com",
  projectId: "gm-store-4f56b",
  storageBucket: "gm-store-4f56b.appspot.com",
  messagingSenderId: "603905078018",
  appId: "1:603905078018:web:41cece9e654351c8eb081b"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;