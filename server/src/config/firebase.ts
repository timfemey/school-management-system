import { initializeApp } from "firebase-admin";

const app = initializeApp({

})

const auth = app.auth()
const firestore = app.firestore()

export { auth, firestore }