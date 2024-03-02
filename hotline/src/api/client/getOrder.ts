import { firestore } from "@/config/firebase"
import { doc, getDoc } from "firebase/firestore"
import { Order } from "@/utils/types"

export default async function getOrder(id: string) {
  try {
    const res = await getDoc(doc(firestore, "orders", id))
    return { ...res.data(), id: res.id } as Order
  } catch (err) {
    console.error(err)
    throw err
  }
}
