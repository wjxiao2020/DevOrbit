import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwjlXbq4jrj6S1W90rJawmg4Nkzf7EQh8",
  authDomain: "chatbot-e42fb.firebaseapp.com",
  projectId: "chatbot-e42fb",
  storageBucket: "chatbot-e42fb.appspot.com",
  messagingSenderId: "321442620408",
  appId: "1:321442620408:web:aa4139a510ddf07500ec0d"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export {app, firestore};