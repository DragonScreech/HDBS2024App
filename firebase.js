import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvu_sMUwANPiSFI7j9wrNBUVhxZ2BvXxY",
  authDomain: "hbdsapp.firebaseapp.com",
  projectId: "hbdsapp",
  storageBucket: "hbdsapp.appspot.com",
  messagingSenderId: "688032207882",
  appId: "1:688032207882:web:57d23be5587aa7db44bbf3",
  measurementId: "G-BRQ36NV60W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const storage = getStorage(app)