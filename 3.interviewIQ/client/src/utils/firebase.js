
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interview-a6484.firebaseapp.com",
  projectId: "interview-a6484",
  storageBucket: "interview-a6484.firebasestorage.app",
  messagingSenderId: "471910007251",
  appId: "1:471910007251:web:6297b13711b0e7cd2bef26"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export {auth , provider}