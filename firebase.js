// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAoDXd-i74hZQzMUJAq_ToxS2izFDDT5RY",
  authDomain: "space-dwarfes.firebaseapp.com",
  projectId: "space-dwarfes",
  storageBucket: "space-dwarfes.appspot.com",
  messagingSenderId: "841545828582",
  appId: "1:841545828582:web:fb8a8248ee8ca00def1327",
  measurementId: "G-XY6ZCCSFC8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);