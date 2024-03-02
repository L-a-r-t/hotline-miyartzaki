import { firestore } from "@/config/firebase"
import { Menu } from "@/utils/types"
import dayjs from "dayjs"
import { addDoc, collection } from "firebase/firestore"

export default async function createMenu(menu: Menu) {
  try {
    const res = await addDoc(collection(firestore, "menus"), {
      name: menu.name,
      desc: menu.desc,
      content: menu.content,
      day: dayjs(menu.day).format("YYYY-MM-DD"),
      price: menu.price,
      type: menu.type,
    } as Menu)
  } catch (err) {
    console.error(err)
    throw err
  }
}
