import { firestore } from "@/config/firebase"
import { doc, updateDoc } from "firebase/firestore"

export default async function updateOrder(
  orderId: string,
  update: { chamber: string; askedDeliveryTime: string }
) {
  try {
    await updateDoc(doc(firestore, "orders", orderId), {
      ...update,
    })
  } catch (err) {
    console.error(err)
    throw err
  }
}
