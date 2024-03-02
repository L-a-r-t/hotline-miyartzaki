import { firestore } from "@/config/firebase"
import { Menu } from "@/utils/types"
import { collection, getDocs } from "firebase/firestore"

export default async function getAllMenus() {
  try {
    const res = await getDocs(collection(firestore, "menus"))
    const docs = res.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Menu))
    return docs
  } catch (err) {
    console.error(err)
    throw err
  }
}
