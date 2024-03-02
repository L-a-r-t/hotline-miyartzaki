import { firestore } from "@/config/firebase"
import { doc, updateDoc } from "firebase/firestore"

export default async function rependOrder(orderId: string) {
  try {
    await updateDoc(doc(firestore, "orders", orderId), {
      status: "cancel",
    })
  } catch (err) {
    console.error(err)
    throw err
  }
}
