import { firestore } from "@/config/firebase"
import { doc, getDoc } from "firebase/firestore"
import { MealData } from "@/utils/types"

export default async function getMeal(id: string) {
  try {
    const res = await getDoc(doc(firestore, "meals", id))
    return { ...res.data(), id: res.id } as MealData
  } catch (err) {
    console.error(err)
    throw err
  }
}
