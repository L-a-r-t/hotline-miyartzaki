import { onDocumentCreated } from "firebase-functions/v2/firestore"
import { firestore } from "../config/firebase"
import { HotlineMenu, Order } from "../types"

export const onOrderCreated = onDocumentCreated(
  { document: "orders/{orderId}", region: "europe-west1" },
  async (event) => {
    const data = event.data?.data() as Order
    firestore()
      .doc(`users/${data.author}`)
      .update({
        orders: firestore.FieldValue.arrayUnion(event.params?.orderId),
      })

    const id = event.params?.orderId
    const shortId = id.slice(0, 6).toUpperCase()

    const author = (await firestore().doc(`users/${data.author}`).get()).data()

    firestore()
      .doc(`orders/${event.params?.orderId}`)
      .update({
        // price,
        id,
        shortId,
        authorData: author
          ? {
              firstName: author.firstName,
              lastName: author.lastName,
              phone: author.phone,
            }
          : null,
        status: data.price == 0 ? "preparation" : "pending",
      })

    if (data.ordertype == "reservation" && data.type == "diner2") {
      const deliveryOptions = (
        await firestore().doc(`global/delivery`).get()
      ).data() as Record<string, any[]>
      if (!deliveryOptions) throw "No delivery options found"
      const deliveryOptionIndex = Object.values(
        deliveryOptions[data.day ?? ""]
      ).findIndex((option) => option.hour == data.deliveryTime)
      Object.values(data.menus).forEach((menu) => {
        if (menu.type != "diner") return
        firestore()
          .doc(`global/delivery`)
          .update({
            [`${data.day}.options.${deliveryOptionIndex}.stock`]:
              firestore.FieldValue.increment(-1),
          })
      })
    }

    if (data.menus["HOTLINE"]) {
      const hotline = (
        await firestore().doc(`menus/HOTLINE`).get()
      ).data() as HotlineMenu

      const orderContent = data.menus["HOTLINE"].content
      const meals = Object.values(orderContent).reduce((acc, meal) => {
        acc[meal.id] = { id: meal.id, qty: meal.qty }
        return acc
      }, {} as Record<string, { id: string; qty: number }>)

      Object.entries(hotline.content).forEach(([sectionName, section]) =>
        Object.values(section.meals).forEach((meal, i) => {
          if (meals[meal.id]) {
            firestore()
              .doc(`menus/HOTLINE`)
              .update({
                [`content.${sectionName}.meals.${i}.stock`]:
                  firestore.FieldValue.increment(-meals[meal.id].qty),
              })
          }
        })
      )
    }
  }
)
