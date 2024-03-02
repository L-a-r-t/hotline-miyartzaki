import { auth, firestore } from "@/config/firebase"
import { updateProfile } from "firebase/auth"
import { doc, updateDoc } from "firebase/firestore"

export default async function onboard(firstName: string, lastName: string) {
  try {
    await Promise.all([
      updateProfile(auth.currentUser!, { displayName: firstName }),
      updateDoc(doc(firestore, "users", auth.currentUser!.uid), {
        firstName,
        lastName,
      }),
    ])
  } catch (err) {
    console.error(err)
    throw err
  }
}
