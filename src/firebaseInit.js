
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6Ave5VU1FgrFMJCAGCclQvdMd-l8P0To",
  authDomain: "buybusy-ba537.firebaseapp.com",
  projectId: "buybusy-ba537",
  storageBucket: "buybusy-ba537.appspot.com",
  messagingSenderId: "918705385001",
  appId: "1:918705385001:web:fbba77020825737ee77638"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

export {db, auth};