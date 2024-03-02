import { firestore } from "@/config/firebase"
import { doc, updateDoc } from "firebase/firestore"

export default async function devalidateMenuDelivery(
  orderId: string,
  menuId: string
) {
  try {
    await updateDoc(doc(firestore, "orders", orderId), {
      [`menus.${menuId}.status`]: "pending",
    })
  } catch (err) {
    console.error(err)
    throw err
  }
}
