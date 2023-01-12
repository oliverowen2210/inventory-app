const { initializeApp } = require("firebase/app");

const firebaseConfig = {
  apiKey: "AIzaSyDpZWWsgT42Jc2izOHkXv2sCtZ0vL8DFhw",
  authDomain: "inventory-app-2cdf8.firebaseapp.com",
  projectId: "inventory-app-2cdf8",
  storageBucket: "inventory-app-2cdf8.appspot.com",
  messagingSenderId: "568033598928",
  appId: "1:568033598928:web:051f796d01e0012dfd6dd5",
};

const app = initializeApp(firebaseConfig);

module.exports = app;
