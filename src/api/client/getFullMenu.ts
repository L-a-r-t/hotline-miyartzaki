import { firestore } from "@/config/firebase"
import {
  collection,
  query,
  where,
  getDocs,
  runTransaction,
  doc,
} from "firebase/firestore"
import { MealData, Menu } from "@/utils/types"
import getMeals from "./getMeals"

export default async function getFullMenu(menuId: string) {
  try {
    const res = await runTransaction(firestore, async (transaction) => {
      const menu = await transaction.get(doc(firestore, "menus", menuId))
      if (!menu.exists()) {
        throw "Menu not found"
      }
      const mealsId = Object.values(menu.data()?.content).map(
        (content: any) => content.meals
      )
      const meals = await Promise.all(
        mealsId.map((id: string) =>
          transaction.get(doc(firestore, "meals", id))
        )
      )
      const mealsData = meals.reduce((acc, meal) => {
        acc[meal.id] = meal.data() as MealData
        return acc
      }, {} as Record<string, MealData>)
      return { menu: menu.data() as Menu, meals: mealsData, id: menuId }
    })
    return res
  } catch (err) {
    console.log(err)
    throw err
  }
}
