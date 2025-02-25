// firebase.js
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  update,
  off,
  set,
  get,
  onValue,
  push,
  query,
  orderByChild,
} from "firebase/database";


// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.API_KEY_DB,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: "trivialbased",
  storageBucket: process.env.STORAGE_BUCK,
  messagingSenderId: process.env.SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export {
  app,
  database,
  update,
  ref,
  off,
  set,
  get,
  getDatabase,
  push,
  onValue,
  query,
  orderByChild,
};
