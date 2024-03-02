import { firestore } from "@/config/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"
import { Order } from "@/utils/types"

export default async function getOngoingOrders() {
  try {
    const _query = query(
      collection(firestore, "orders"),
      where("status", "in", ["pending", "preparation", "cancelled"])
    )
    const res = await getDocs(_query)
    const docs = res.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Order))
    console.log(docs)
    return docs
  } catch (err) {
    console.error(err)
    throw err
  }
}
