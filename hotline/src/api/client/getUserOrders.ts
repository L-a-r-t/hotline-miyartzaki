import { firestore, auth } from "@/config/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"
import { Order, OrderData } from "@/utils/types"

export default async function getUserOrders() {
  try {
    if (auth.currentUser === null) throw new Error("Not logged in")
    const _query = query(
      collection(firestore, "orders"),
      where("author", "==", auth.currentUser.uid)
    )
    const res = await getDocs(_query)
    const docs = res.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Order))
    return docs
  } catch (err) {
    console.error(err)
    throw err
  }
}
