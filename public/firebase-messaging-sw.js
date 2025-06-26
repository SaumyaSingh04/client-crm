/* eslint-disable no-undef */
// firebase-messaging-sw.js

// Import Firebase scripts
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// Initialize Firebase (use same config as frontend)
firebase.initializeApp({
  apiKey: "AIzaSyA6LM4YVdb27CSCYEG6RCOJQ9FdCxTFMuA",
  authDomain: "crms-7ec70.firebaseapp.com",
  projectId: "crms-7ec70",
  storageBucket: "crms-7ec70.appspot.com",
  messagingSenderId: "823887970139",
  appId: "1:823887970139:web:e58977503889336e83e47e",
});

// Retrieve messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log("🔔 Received background message:", payload);

  const { title, body } = payload.notification || {
    title: "CRM Reminder",
    body: "You have an upcoming meeting",
  };

  self.registration.showNotification(title, {
    body,
    icon: "/logo192.png", // Optional: put icon in public folder
  });
});
