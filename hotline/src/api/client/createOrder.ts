import { firestore } from "@/config/firebase"
import { Order, OrderRecap } from "@/utils/types"
import { addDoc, setDoc, collection, serverTimestamp } from "firebase/firestore"

export default async function createReservation({
  orderRecap,
  userId,
  date,
  targetDay,
  askedDeliveryTime,
  chamber,
}: Params) {
  try {
    const order = Object.entries(orderRecap).reduce(
      (acc, [menu, data]) => {
        acc.price +=
          data.price == 0
            ? data.items.reduce(
                (acc, item) => (acc += item.price * item.qty),
                0
              )
            : data.price
        if (!acc.menus[menu]) acc.menus[menu] = {} as any
        acc.menus[menu].name = data.items[0].menu
        acc.menus[menu].status = "pending"
        acc.menus[menu].type = data.items[0].time as any
        acc.menus[menu].qty = 1
        acc.menus[menu].content = data.items.reduce((acc, item) => {
          acc[item.mealId] = {
            id: item.mealId,
            name: item.meal,
            qty: item.qty,
          }
          return acc
        }, {} as Record<string, { id: string; name: string; qty: number }>)
        return acc
      },
      {
        author: userId,
        reservationTime: serverTimestamp() as any,
        date: date,
        ordertype: "order",
        status: "pending",
        price: 0,
        menus: {},
      } as any
    )
    order.price = Math.round(order.price * 100) / 100
    if (chamber) {
      order.chamber = chamber
      order.askedDeliveryTime = askedDeliveryTime
    }
    if (targetDay) order.day = targetDay
    const res = await addDoc(collection(firestore, "orders"), order)
    await new Promise((resolve) => setTimeout(resolve, 2000)) // idgaf
    return res
  } catch (err) {
    console.error(err)
    throw err
  }
}

type Params = {
  orderRecap: OrderRecap
  userId: string
  date: number
  targetDay?: string
  askedDeliveryTime?: string
  chamber?: string
}
