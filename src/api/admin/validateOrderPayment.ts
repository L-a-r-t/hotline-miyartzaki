import { firestore } from "@/config/firebase"
import { doc, updateDoc } from "firebase/firestore"

export default async function validateOrderPayment(orderId: string) {
  try {
    await updateDoc(doc(firestore, "orders", orderId), {
      status: "preparation",
    })
  } catch (err) {
    console.error(err)
    throw err
  }
}
