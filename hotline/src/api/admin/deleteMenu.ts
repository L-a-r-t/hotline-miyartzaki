import { firestore } from "@/config/firebase"
import { deleteDoc, doc } from "firebase/firestore"

export default async function deleteMenu(id: string) {
  try {
    const res = await deleteDoc(doc(firestore, "menus", id))
  } catch (err) {
    console.error(err)
    throw err
  }
}
