import { firestore } from "@/config/firebase"
import { doc, updateDoc } from "firebase/firestore"

export default async function validateMenuDelivery(
  orderId: string,
  menuId: string
) {
  try {
    await updateDoc(doc(firestore, "orders", orderId), {
      [`menus.${menuId}.status`]: "delivered",
    })
  } catch (err) {
    console.error(err)
    throw err
  }
}
