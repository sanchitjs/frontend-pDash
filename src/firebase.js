import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyDW2dCIhIfTZEevlRyIjZ7RjhfJQCxFxk0",
  authDomain: "test-35f13.firebaseapp.com",
  databaseURL: "https://test-35f13-default-rtdb.firebaseio.com",
  projectId: "test-35f13",
  storageBucket: "test-35f13.appspot.com",
  messagingSenderId: "977362711670",
  appId: "1:977362711670:web:13ef6b216d18b721a99b57",
  measurementId: "G-MQQ5PQBY93"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);