import { firestore } from "@/config/firebase"
import { MealData } from "@/utils/types"
import { addDoc, collection } from "firebase/firestore"

export default async function createMeal(meal: MealData) {
  try {
    const res = await addDoc(collection(firestore, "meals"), {
      name: meal.name,
      price: meal.price,
      desc: meal.desc,
      isVegetarian: meal.isVegetarian,
      ingredients: meal.ingredients,
    } as MealData)
  } catch (err) {
    console.error(err)
    throw err
  }
}
