import { firestore } from "@/config/firebase"
import { DaySettings, DeliveryOption } from "@/utils/types"
import { doc, getDoc } from "firebase/firestore"

export default async function getDeliveryOptions() {
  try {
    const res = await getDoc(doc(firestore, "global", "delivery"))
    const data = res.data() as Record<string, DaySettings | undefined>
    return data
  } catch (err) {
    console.error(err)
    throw err
  }
}
