import { firestore } from "@/config/firebase"
import { MealData } from "@/utils/types"
import { collection, getDocs } from "firebase/firestore"

export default async function getAllMeals() {
  try {
    const res = await getDocs(collection(firestore, "meals"))
    const docs = res.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id } as MealData)
    )
    return docs
  } catch (err) {
    console.error(err)
    throw err
  }
}
