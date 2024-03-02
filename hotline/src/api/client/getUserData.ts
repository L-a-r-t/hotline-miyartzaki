import { auth, firestore } from "@/config/firebase"
import { doc, getDoc } from "firebase/firestore"
import { UserData } from "@/utils/types"

export default async function getUserData() {
  try {
    if (!auth.currentUser) throw new Error("Not logged in")
    const res = await getDoc(doc(firestore, "users", auth.currentUser.uid))
    return res.data() as UserData
  } catch (err) {
    console.error(err)
    throw err
  }
}
