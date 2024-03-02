import { firestore } from "@/config/firebase"
import { MealData } from "@/utils/types"
import { doc, updateDoc } from "firebase/firestore"

export default async function updateMeal(meal: Omit<MealData, "img">) {
  try {
    const res = await updateDoc(doc(firestore, "meals", meal.id), {
      name: meal.name,
      desc: meal.desc,
      price: meal.price,
      isVegetarian: meal.isVegetarian,
      ingredients: meal.ingredients,
    } as MealData)
  } catch (err) {
    console.error(err)
    throw err
  }
}
