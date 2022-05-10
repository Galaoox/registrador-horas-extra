import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


export const firebaseConfig = {
    apiKey: "AIzaSyCrFvpKzoXBI923maXpVnPXr6-bUuUvFoo",
    authDomain: "registro-horas-44dfa.firebaseapp.com",
    projectId: "registro-horas-44dfa",
    storageBucket: "registro-horas-44dfa.appspot.com",
    messagingSenderId: "782787232525",
    appId: "1:782787232525:web:4a2275c45316bd1eeee644"
  };

export const firebaseApp = initializeApp(firebaseConfig);


export const db = getFirestore(firebaseApp);

export const storage = getStorage(firebaseApp);