import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getFunctions } from "firebase/functions"

const firebaseConfig = {
  apiKey: "AIzaSyBrUv53z-hHMky4jjZhtiAQwikDd7uC2cA",
  authDomain: "hotlines-myartzaki.firebaseapp.com",
  projectId: "hotlines-myartzaki",
  storageBucket: "hotlines-myartzaki.appspot.com",
  messagingSenderId: "550876342104",
  appId: "1:550876342104:web:82a38f5de9f38d3df9272d",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const firestore = getFirestore(app)
export const functions = getFunctions(app, "europe-west1")
