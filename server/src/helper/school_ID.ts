import { firestore } from "../config/firebase.js";

export async function checkIfSchoolIdHasBeenUsed(id: string) {
    try {
        const doc = await firestore.collection("schools").doc(id).get()
        const exists = doc.exists
        return exists;
    } catch (error) {
        console.error("Error Occured while checking if School Id has been used")
        console.error(error)
    }

}