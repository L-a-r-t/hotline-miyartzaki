import { firestore } from "@/config/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"
import dayjs from "dayjs"
import { DayDelta, FullMenu, Menu } from "@/utils/types"
import getMeals from "../client/getMeals"
import { entries, values } from "@/utils/functions"

/**
 * Utiliser cette fonction coter admin pour voir même les menus cloturés
 */
export default async function getUpcomingMenus() {
  try {
    const _query = query(
      collection(firestore, "menus"),
      where("day", ">=", dayjs().format("YYYY-MM-DD"))
    )
    const res = await getDocs(_query)

    const docs = res.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Menu))

    let mealsIds = docs
      .map((doc) =>
        values(doc.content).map((section) =>
          values(section.meals).map((meal) => meal.id)
        )
      )
      .flat(2)

    mealsIds = mealsIds.filter((meal, i) => mealsIds.indexOf(meal) === i)
    const meals = await getMeals(mealsIds)
    const menus = docs.map(
      (doc) =>
        ({
          ...doc,
          content: entries(doc.content).reduce((acc, [key, value]) => {
            acc[key] = {
              ...value,
              qty: 0,
              meals: values(value.meals).map((meal) => ({
                ...meals.find((m) => m.id === meal.id),
                qty: 0,
              })),
            }
            return acc
          }, {} as any),
        } as FullMenu)
    )

    const sortedMenus = menus.reduce(
      (acc, menu) => {
        //faudrait en soit coder ça plus proprement. Le format sert à couper l'heure, minute, seconde
        //et donc à avoir un delta de pile 1 jour, mais à 1s de différence, ça casserait tt.
        const delta = dayjs(menu.day).diff(
          dayjs().format("YYYY-MM-DD"),
          "day"
        ) as DayDelta
        acc[delta] = [...(acc[delta] || []), menu]
        return acc
      },
      { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] } as Record<
        DayDelta,
        FullMenu[]
      >
    )
    return sortedMenus
  } catch (err) {
    console.error(err)
    throw err
  }
}
