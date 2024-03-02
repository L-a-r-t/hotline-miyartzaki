import { firestore } from "@/config/firebase"
import { doc, updateDoc } from "firebase/firestore"

export default async function validateOrderDelivery(orderId: string) {
  try {
    await updateDoc(doc(firestore, "orders", orderId), {
      status: "delivered",
    })
  } catch (err) {
    console.error(err)
    throw err
  }
}
