import { firestore } from "@/config/firebase"
import { doc, updateDoc } from "firebase/firestore"

export default async function cancelOrder(orderId: string) {
  await updateDoc(doc(firestore, "orders", orderId), {
    status: "cancelled",
  })
}
