import { firestore } from "@/config/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"
import { MealData, Menu } from "@/utils/types"

export default async function getMeals(mealsId: string[]) {
  try {
    const _mealsId = [...mealsId]
    const batches: string[][] = []
    while (_mealsId.length > 0) {
      batches.push(_mealsId.splice(0, 30))
    }
    const res = await Promise.all(
      batches.map((batch) =>
        getDocs(query(collection(firestore, "meals"), where("id", "in", batch)))
      )
    )
    const docs = res
      .map((r) => r.docs.map((doc) => doc.data() as MealData))
      .flat()
    return docs
  } catch (err) {
    console.error(err)
    throw err
  }
}
