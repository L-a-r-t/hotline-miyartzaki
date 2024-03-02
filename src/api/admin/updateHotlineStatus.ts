import { firestore } from "@/config/firebase"
import { doc, updateDoc } from "firebase/firestore"

export default async function updateHotlineStatus(status: boolean) {
  try {
    await updateDoc(doc(firestore, "global", "hotlines"), "active", status)
  } catch (err) {
    console.error(err)
    throw err
  }
}
