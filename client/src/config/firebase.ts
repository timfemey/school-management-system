import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyAlE79C6-pd1w-L8LXws6E4wcWH3q4NbEA",
    authDomain: "school-management-system-4a705.firebaseapp.com",
    projectId: "school-management-system-4a705",
    storageBucket: "school-management-system-4a705.appspot.com",
    messagingSenderId: "172340354704",
    appId: "1:172340354704:web:df1c15ce90ecb784098215"
};
const app = initializeApp(firebaseConfig)
const auth = initializeAuth(app)
const storage = getStorage(app)


export { auth, storage }