import { firestore } from "@/config/firebase"
import { Menu } from "@/utils/types"
import dayjs from "dayjs"
import { doc, updateDoc } from "firebase/firestore"

export default async function updateMenu(menu: Menu) {
  try {
    const res = await updateDoc(doc(firestore, "menus", menu.id), {
      name: menu.name,
      desc: menu.desc,
      content: menu.content,
      day: menu.id.includes("HOTLINE")
        ? menu.day
        : dayjs(menu.day).format("YYYY-MM-DD"),
      price: menu.price,
      type: menu.type,
    } as Menu)
  } catch (err) {
    console.error(err)
    throw err
  }
}
