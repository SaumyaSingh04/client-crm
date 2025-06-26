// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyA6LM4YVdb27CSCYEG6RCOJQ9FdCxTFMuA",
  authDomain: "crms-7ec70.firebaseapp.com",
  projectId: "crms-7ec70",
  storageBucket: "crms-7ec70.appspot.com",
  messagingSenderId: "823887970139",
  appId: "1:823887970139:web:e58977503889336e83e47e",
  measurementId: "G-KNF0BC5JH2"
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export { messaging, getToken, onMessage };
