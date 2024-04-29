import { initializeApp } from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

const app = initializeApp({

})

const auth = app.auth()
const firestore = app.firestore()
const timestamp = Timestamp

export { auth, firestore, timestamp }