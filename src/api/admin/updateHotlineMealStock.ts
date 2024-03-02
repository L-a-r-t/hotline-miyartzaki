import { firestore } from "@/config/firebase"
import { MealData } from "@/utils/types"
import { doc, updateDoc } from "firebase/firestore"

export default async function updateHotlineMealStock(
  stock: number,
  {
    mealIndex,
    sectionName,
  }: {
    mealIndex: string
    sectionName: string
  }
) {
  try {
    await updateDoc(
      doc(firestore, "menus", "HOTLINE"),
      `content.${sectionName}.meals.${mealIndex}.stock`,
      stock
    )
  } catch (err) {
    console.error(err)
    throw err
  }
}
