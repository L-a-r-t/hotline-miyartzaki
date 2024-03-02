import { firestore } from "@/config/firebase"
import { doc, getDoc } from "firebase/firestore"
import { Menu } from "@/utils/types"

export default async function getMenu(id: string) {
  try {
    const res = await getDoc(doc(firestore, "menus", id))
    return { ...res.data(), id: res.id } as Menu
  } catch (err) {
    console.error(err)
    throw err
  }
}
