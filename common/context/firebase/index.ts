import "firebase/compat/auth";
import compatApp from "firebase/compat/app";
import firebase from "firebase/compat/app";

export const creds = {
  apiKey: String(process.env.NEXT_PUBLIC_REACT_APP_API_KEY),
  authDomain: String(process.env.NEXT_PUBLIC_REACT_APP_AUTH_DOMAIN),
  databaseURL: String(process.env.NEXT_PUBLIC_REACT_APP_DATABASE_URL),
  projectId: String(process.env.NEXT_PUBLIC_REACT_APP_PROJECT_ID),
  storageBucket: String(process.env.NEXT_PUBLIC_REACT_APP_STORAGE_BUCKET),
  messagingSenderId: String(process.env.NEXT_PUBLIC_REACT_APP_MESSAGING_SENDER_ID),
  appId: String(process.env.NEXT_PUBLIC_REACT_APP_ID),
  measurementId: String(process.env.NEXT_PUBLIC_REACT_APP_MEASUREMENT_ID),
};

export const app = firebase.apps.length == 0 ? compatApp.initializeApp(creds) : firebase.apps[0];
